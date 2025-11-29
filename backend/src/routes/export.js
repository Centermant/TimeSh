// backend/src/routes/export.js
import adminService from '../services/adminService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function routes(fastify, options) {
  fastify.addHook('preHandler', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return reply.code(401).send({ error: 'Authorization header missing or malformed (Basic Auth required)' });
    }

    const base64Credentials = authHeader.substring(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (!username || !password) {
      return reply.code(401).send({ error: 'Username and password required in Basic Auth' });
    }

    const userQuery = 'SELECT id, emp_id, full_name, username, password_hash, role FROM employees WHERE username = $1';
    const { rows } = await fastify.pg.query(userQuery, [username]);
    const user = rows[0];

    if (!user) {
      return reply.code(401).send({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return reply.code(401).send({ error: 'Invalid username or password' });
    }

    if (user.role !== 'admin') {
      return reply.code(403).send({ error: 'Access denied. Admin role required.' });
    }

    request.user = user;
  });

  fastify.get('/worklogs', async (request, reply) => {
    try {
      const timesheetsQuery = `
        SELECT
          e.emp_id,
          e.full_name,
          e.date_of_birth,
          p.department_guid,
          t.pos_id,
          ep.assigned_rate,
          t.date_work,
          t.check_in,
          t.check_out
        FROM timesheets t
        JOIN employees e ON t.emp_id = e.emp_id
        JOIN employee_positions ep ON t.emp_id = ep.emp_id AND t.pos_id = ep.pos_id
        JOIN positions p ON t.pos_id = p.pos_id
        ORDER BY e.full_name, t.pos_id, t.date_work;
      `;
      const timesheetResult = await fastify.pg.query(timesheetsQuery);
      const allTimesheets = timesheetResult.rows;

      const assignmentsQuery = `
        SELECT
          e.emp_id,
          e.full_name,
          e.date_of_birth,
          p.department_guid,
          ep.pos_id,
          ep.assigned_rate
        FROM employee_positions ep
        JOIN employees e ON ep.emp_id = e.emp_id
        JOIN positions p ON ep.pos_id = p.pos_id
        ORDER BY e.full_name, ep.pos_id;
      `;
      const assignmentsResult = await fastify.pg.query(assignmentsQuery);
      const allAssignments = assignmentsResult.rows;

      const exportData = {
        employees: []
      };

      const timesheetsByEmpAndPos = {};
      allTimesheets.forEach(ts => {
        const key = `${ts.emp_id}-${ts.pos_id}`;
        if (!timesheetsByEmpAndPos[key]) {
          timesheetsByEmpAndPos[key] = {
            emp_info: {
              full_name: ts.full_name,
              date_of_birth: new Date(ts.date_of_birth).toLocaleDateString('ru-RU'),
            },
            pos_info: {
              GUID: ts.department_guid || 'unknown',
              posId: ts.pos_id,
              rate: ts.assigned_rate,
              worklogs: []
            }
          };
        }
        // Убираем pos_id из объекта worklog
        timesheetsByEmpAndPos[key].pos_info.worklogs.push({
          date: new Date(ts.date_work).toLocaleDateString('ru-RU'),
          check_in: ts.check_in,
          check_out: ts.check_out
          // pos_id удален
        });
      });

      const assignmentsByEmp = {};
      allAssignments.forEach(ass => {
        if (!assignmentsByEmp[ass.emp_id]) {
          assignmentsByEmp[ass.emp_id] = {
            full_name: ass.full_name,
            date_of_birth: new Date(ass.date_of_birth).toLocaleDateString('ru-RU'),
            posts: {}
          };
        }
        const posKey = ass.pos_id;
        const timesheetKey = `${ass.emp_id}-${ass.pos_id}`;
        if (timesheetsByEmpAndPos[timesheetKey]) {
          assignmentsByEmp[ass.emp_id].posts[posKey] = timesheetsByEmpAndPos[timesheetKey].pos_info;
        } else {
          assignmentsByEmp[ass.emp_id].posts[posKey] = {
            GUID: ass.department_guid || 'unknown',
            posId: ass.pos_id,
            rate: ass.assigned_rate,
            worklogs: []
          };
        }
      });

      for (const empId in assignmentsByEmp) {
        const empData = assignmentsByEmp[empId];
        exportData.employees.push({
          full_name: empData.full_name,
          date_of_birth: empData.date_of_birth,
          posts: Object.values(empData.posts)
        });
      }

      reply.header('Content-Type', 'application/json');
      reply.header('Content-Disposition', 'attachment; filename=worklogs_export.json');
      reply.send(exportData);

    } catch (err) {
      console.error('Export worklogs error:', err);
      reply.code(500).send({ error: 'Internal Server Error during export' });
    }
  });
}