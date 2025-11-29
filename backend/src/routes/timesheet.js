// backend/src/routes/timesheet.js
import timesheetService from '../services/timesheetService.js';

export default async function routes(fastify, options) {
  fastify.post('/check-in', async (request, reply) => {
    const { emp_id, pos_id, date_work, check_in_time } = request.body;

    if (!emp_id || !pos_id || !date_work || !check_in_time) {
      return reply.code(400).send({ error: 'emp_id, pos_id, date_work, and check_in_time are required' });
    }

    try {
      const timesheet = await timesheetService.createCheckIn(fastify.pg, emp_id, pos_id, date_work, check_in_time);
      reply.code(201).send(timesheet);
    } catch (err) {
      console.error('Check-in error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/check-out', async (request, reply) => {
    const { emp_id, pos_id, date_work, check_out_time } = request.body;

    if (!emp_id || !pos_id || !date_work || !check_out_time) {
      return reply.code(400).send({ error: 'emp_id, pos_id, date_work, and check_out_time are required' });
    }

    try {
      const timesheet = await timesheetService.updateCheckOut(fastify.pg, emp_id, pos_id, date_work, check_out_time);
      reply.send(timesheet);
    } catch (err) {
      console.error('Check-out error:', err);
      if (err.message === 'Timesheet record not found for check-out update') {
        return reply.code(404).send({ error: err.message });
      }
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/emp/:emp_id/date/:date_work', async (request, reply) => {
    const { emp_id, date_work } = request.params;

    if (!emp_id || !date_work) {
      return reply.code(400).send({ error: 'emp_id and date_work are required' });
    }

    try {
      const timesheets = await timesheetService.getTimesheetsByEmpAndDate(fastify.pg, emp_id, date_work);
      reply.send(timesheets);
    } catch (err) {
      console.error('Get timesheets by emp and date error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/emp/:emp_id/month/:month', async (request, reply) => {
    const { emp_id, month } = request.params;

    if (!emp_id || !month) {
      return reply.code(400).send({ error: 'emp_id and month are required' });
    }

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return reply.code(400).send({ error: 'month must be in YYYY-MM format (e.g., 2025-01)' });
    }

    try {
      const timesheets = await timesheetService.getTimesheetsByEmpAndMonth(fastify.pg, emp_id, month);
      reply.send(timesheets);
    } catch (err) {
      console.error('Get timesheets by emp and month error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/employee/:emp_id/positions', async (request, reply) => {
    const { emp_id } = request.params;

    if (!emp_id) {
      return reply.code(400).send({ error: 'emp_id is required' });
    }

    try {
      const query = `
        SELECT ep.emp_id, ep.pos_id, ep.assigned_rate, p.title AS position_title
        FROM employee_positions ep
        JOIN positions p ON ep.pos_id = p.pos_id
        WHERE ep.emp_id = $1
        ORDER BY p.title;
      `;
      const { rows } = await fastify.pg.query(query, [emp_id]);

      reply.send(rows);
    } catch (err) {
      console.error('Get employee positions error:', err);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}