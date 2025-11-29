// backend/src/services/adminService.js
import bcrypt from 'bcryptjs';

class AdminService {
  async getAllEmployees(db) {
    const query = `
      SELECT
        e.emp_id,
        e.full_name,
        e.date_of_birth,
        e.username,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'pos_id', p.pos_id,
              'title', p.title,
              'assigned_rate', ep.assigned_rate
            )
          ) FILTER (WHERE p.pos_id IS NOT NULL), '[]'::json
        ) AS positions
      FROM employees e
      LEFT JOIN employee_positions ep ON e.emp_id = ep.emp_id
      LEFT JOIN positions p ON ep.pos_id = p.pos_id
      GROUP BY e.id, e.emp_id, e.full_name, e.date_of_birth, e.username
      ORDER BY e.full_name;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  async addEmployee(db, employeeData) {
    const { emp_id, full_name, date_of_birth, username, password, role = 'employee' } = employeeData;

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO employees (emp_id, full_name, date_of_birth, username, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const { rows } = await db.query(query, [emp_id, full_name, date_of_birth, username, password_hash, role]);

    return rows[0];
  }

  async getAllDepartments(db) {
    const query = 'SELECT id, guid, name FROM departments ORDER BY name';
    const { rows } = await db.query(query);
    return rows;
  }

  async getAllPositions(db) {
    const query = 'SELECT id, pos_id, title, total_rate, department_guid FROM positions ORDER BY title'; // Добавляем department_guid
    const { rows } = await db.query(query);
    return rows;
  }

  async addDepartment(db, departmentData) {
    const { guid, name } = departmentData;
    const query = 'INSERT INTO departments (guid, name) VALUES ($1, $2) RETURNING *';
    const { rows } = await db.query(query, [guid, name]);
    return rows[0];
  }

  async addPosition(db, positionData) {
    const { pos_id, title, total_rate, department_guid } = positionData; // Добавляем department_guid
    const query = 'INSERT INTO positions (pos_id, title, total_rate, department_guid) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await db.query(query, [pos_id, title, total_rate, department_guid]); // Передаем department_guid
    return rows[0];
  }

  async assignPosition(db, assignmentData) {
    const { emp_id, pos_id, assigned_rate } = assignmentData;
    const query = 'INSERT INTO employee_positions (emp_id, pos_id, assigned_rate) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await db.query(query, [emp_id, pos_id, assigned_rate]);
    return rows[0];
  }

  async getMonthlyReport(db, monthDate) {
    const query = `
      SELECT
        d.name AS department_name,
        e.full_name,
        e.emp_id,
        t.date_work,
        t.check_in,
        t.check_out,
        p.title AS position_title
      FROM timesheets t
      JOIN employees e ON t.emp_id = e.emp_id
      JOIN employee_positions ep ON e.emp_id = ep.emp_id AND t.pos_id = ep.pos_id
      JOIN positions p ON t.pos_id = p.pos_id
      JOIN departments d ON p.department_guid = d.guid -- Используем department_guid из positions
      WHERE t.date_work >= $1::date AND t.date_work < ($1::date + interval '1 month')
      ORDER BY d.name, e.full_name, t.date_work;
    `;
    const { rows } = await db.query(query, [`${monthDate}-01`]);
    return rows;
  }
}

export default new AdminService();