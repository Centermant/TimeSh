// backend/src/routes/admin.js
import adminService from '../services/adminService.js';
import jwt from 'jsonwebtoken';

export default async function routes(fastify, options) {
  // --- Middleware для проверки роли администратора ---
  fastify.addHook('preHandler', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Authorization header missing or malformed' });
    }
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      if (decoded.role !== 'admin') {
        return reply.code(403).send({ error: 'Access denied. Admin role required.' });
      }
      request.user = decoded;
    } catch (err) {
      console.error('Auth middleware error:', err);
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }
  });
  // --- Конец Middleware ---

  // GET /api/admin/employees
  fastify.get('/employees', async (request, reply) => {
    try {
      const employees = await adminService.getAllEmployees(fastify.pg);
      reply.send(employees);
    } catch (err) {
      console.error('Get employees error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // POST /api/admin/employees
  fastify.post('/employees', async (request, reply) => {
    // Извлекаем role из request.body
    const { emp_id, full_name, date_of_birth, username, password, role } = request.body;

    if (!emp_id || !full_name || !date_of_birth || !username || !password) {
      return reply.code(400).send({ error: 'All fields (emp_id, full_name, date_of_birth, username, password) are required' });
    }

    try {
      // Передаём role в сервис
      const newEmployee = await adminService.addEmployee(fastify.pg, {
        emp_id,
        full_name,
        date_of_birth,
        username,
        password,
        role // Передаём роль
      });
      reply.code(201).send(newEmployee);
    } catch (err) {
      console.error('Add employee error:', err);
      if (err.message.includes('duplicate key value')) {
        reply.code(409).send({ error: 'Employee ID or Username already exists' });
      } else {
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    }
  });

  // GET /api/admin/departments
  fastify.get('/departments', async (request, reply) => {
    try {
      const departments = await adminService.getAllDepartments(fastify.pg);
      reply.send(departments);
    } catch (err) {
      console.error('Get departments error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // POST /api/admin/departments
  fastify.post('/departments', async (request, reply) => {
    const { guid, name } = request.body;
    if (!guid || !name) {
      return reply.code(400).send({ error: 'GUID and Name are required' });
    }
    try {
      const newDepartment = await adminService.addDepartment(fastify.pg, { guid, name });
      reply.code(201).send(newDepartment);
    } catch (err) {
      console.error('Add department error:', err);
      if (err.message.includes('duplicate key value')) {
        reply.code(409).send({ error: 'Department GUID already exists' });
      } else {
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    }
  });

  // GET /api/admin/positions
  fastify.get('/positions', async (request, reply) => {
    try {
      const positions = await adminService.getAllPositions(fastify.pg);
      reply.send(positions);
    } catch (err) {
      console.error('Get positions error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // POST /api/admin/positions
  fastify.post('/positions', async (request, reply) => {
    // Извлекаем department_guid из request.body
    const { pos_id, title, total_rate, department_guid } = request.body;
    // Проверяем department_guid
    if (!pos_id || !title || total_rate === undefined || !department_guid) {
      return reply.code(400).send({ error: 'pos_id, title, total_rate, and department_guid are required' });
    }
    try {
      // Передаём department_guid в сервис
      const newPosition = await adminService.addPosition(fastify.pg, { pos_id, title, total_rate, department_guid });
      reply.code(201).send(newPosition);
    } catch (err) {
      console.error('Add position error:', err);
      if (err.message.includes('duplicate key value')) {
        reply.code(409).send({ error: 'Position ID already exists' });
      } else {
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    }
  });

  // POST /api/admin/assign-position
  fastify.post('/assign-position', async (request, reply) => {
    const { emp_id, pos_id, assigned_rate } = request.body;
    if (!emp_id || !pos_id || assigned_rate === undefined) {
      return reply.code(400).send({ error: 'emp_id, pos_id, and assigned_rate are required' });
    }
    try {
      const assignment = await adminService.assignPosition(fastify.pg, { emp_id, pos_id, assigned_rate });
      reply.code(201).send(assignment);
    } catch (err) {
      console.error('Assign position error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // DELETE /api/admin/employees/:emp_id
  fastify.delete('/employees/:emp_id', async (request, reply) => {
    const { emp_id } = request.params;
    if (!emp_id) {
      return reply.code(400).send({ error: 'emp_id is required' });
    }
    try {
        const query = 'DELETE FROM employees WHERE emp_id = $1 RETURNING emp_id';
        const { rows } = await fastify.pg.query(query, [emp_id]);
        if (rows.length === 0) {
            return reply.code(404).send({ error: 'Employee not found' });
        }
        reply.send({ message: 'Employee deleted successfully', deleted_id: rows[0].emp_id });
    } catch (err) {
        console.error('Delete employee error:', err);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // DELETE /api/admin/departments/:guid
  fastify.delete('/departments/:guid', async (request, reply) => {
    const { guid } = request.params;
    if (!guid) {
      return reply.code(400).send({ error: 'guid is required' });
    }
    try {
        const query = 'DELETE FROM departments WHERE guid = $1 RETURNING guid';
        const { rows } = await fastify.pg.query(query, [guid]);
        if (rows.length === 0) {
            return reply.code(404).send({ error: 'Department not found' });
        }
        reply.send({ message: 'Department deleted successfully', deleted_guid: rows[0].guid });
    } catch (err) {
        console.error('Delete department error:', err);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // DELETE /api/admin/positions/:pos_id
  fastify.delete('/positions/:pos_id', async (request, reply) => {
    const { pos_id } = request.params;
    if (!pos_id) {
      return reply.code(400).send({ error: 'pos_id is required' });
    }
    try {
        const query = 'DELETE FROM positions WHERE pos_id = $1 RETURNING pos_id';
        const { rows } = await fastify.pg.query(query, [pos_id]);
        if (rows.length === 0) {
            return reply.code(404).send({ error: 'Position not found' });
        }
        reply.send({ message: 'Position deleted successfully', deleted_pos_id: rows[0].pos_id });
    } catch (err) {
        console.error('Delete position error:', err);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // DELETE /api/admin/assignments/:id
  fastify.delete('/assignments/:id', async (request, reply) => {
    const { id } = request.params;
    if (!id) {
      return reply.code(400).send({ error: 'id is required' });
    }
    try {
        const query = 'DELETE FROM employee_positions WHERE id = $1 RETURNING id';
        const { rows } = await fastify.pg.query(query, [id]);
        if (rows.length === 0) {
            return reply.code(404).send({ error: 'Assignment not found' });
        }
        reply.send({ message: 'Assignment deleted successfully', deleted_id: rows[0].id });
    } catch (err) {
        console.error('Delete assignment error:', err);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // GET /api/admin/assignments
  fastify.get('/assignments', async (request, reply) => {
    try {
        const query = `
            SELECT ep.id, ep.emp_id, ep.pos_id, ep.assigned_rate, e.full_name, p.title, p.department_guid -- Добавляем department_guid
            FROM employee_positions ep
            JOIN employees e ON ep.emp_id = e.emp_id
            JOIN positions p ON ep.pos_id = p.pos_id
            ORDER BY e.full_name, p.title;
        `;
        const { rows } = await fastify.pg.query(query);
        reply.send(rows);
    } catch (err) {
        console.error('Get assignments error:', err);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // GET /api/admin/reports/monthly?month=YYYY-MM
  fastify.get('/reports/monthly', async (request, reply) => {
    const { month } = request.query;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return reply.code(400).send({ error: 'Query parameter "month" is required and must be in YYYY-MM format (e.g., 2025-01)' });
    }
    try {
      const report = await adminService.getMonthlyReport(fastify.pg, month);
      reply.send(report);
    } catch (err) {
      console.error('Get monthly report error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}