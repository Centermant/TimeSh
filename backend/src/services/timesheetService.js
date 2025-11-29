// backend/src/services/timesheetService.js

class TimesheetService {
  /**
   * Создает или обновляет отметку о времени (check-in).
   * @param {Object} db - Объект подключения к БД.
   * @param {string} emp_id - ID сотрудника.
   * @param {string} pos_id - ID должности.
   * @param {string} date_work - Дата в формате 'YYYY-MM-DD'.
   * @param {string} check_in_time - Время прихода в формате 'HH:MM'.
   */
  async createCheckIn(db, emp_id, pos_id, date_work, check_in_time) {
    // Проверим, есть ли уже запись на эту дату и должность для сотрудника
    const checkQuery = 'SELECT id FROM timesheets WHERE emp_id = $1 AND pos_id = $2 AND date_work = $3';
    const { rows } = await db.query(checkQuery, [emp_id, pos_id, date_work]);

    let query;
    let params;

    if (rows.length > 0) {
      // Запись существует, обновляем check_in
      query = 'UPDATE timesheets SET check_in = $4, check_out = NULL WHERE emp_id = $1 AND pos_id = $2 AND date_work = $3 RETURNING *';
      params = [emp_id, pos_id, date_work, check_in_time];
    } else {
      // Записи нет, создаем новую
      query = 'INSERT INTO timesheets (emp_id, pos_id, date_work, check_in) VALUES ($1, $2, $3, $4) RETURNING *';
      params = [emp_id, pos_id, date_work, check_in_time];
    }

    const result = await db.query(query, params);
    return result.rows[0];
  }

  /**
   * Обновляет отметку о времени (check-out).
   * @param {Object} db - Объект подключения к БД.
   * @param {string} emp_id - ID сотрудника.
   * @param {string} pos_id - ID должности.
   * @param {string} date_work - Дата в формате 'YYYY-MM-DD'.
   * @param {string} check_out_time - Время ухода в формате 'HH:MM'.
   */
  async updateCheckOut(db, emp_id, pos_id, date_work, check_out_time) {
    const query = 'UPDATE timesheets SET check_out = $4 WHERE emp_id = $1 AND pos_id = $2 AND date_work = $3 RETURNING *';
    const params = [emp_id, pos_id, date_work, check_out_time];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      throw new Error('Timesheet record not found for check-out update');
    }

    return result.rows[0];
  }

  /**
   * Получает все отметки для конкретного сотрудника за конкретную дату.
   * @param {Object} db - Объект подключения к БД.
   * @param {string} emp_id - ID сотрудника.
   * @param {string} date_work - Дата в формате 'YYYY-MM-DD'.
   * @returns {Array} - Массив отметок.
   */
  async getTimesheetsByEmpAndDate(db, emp_id, date_work) {
    const query = `
      SELECT t.*, p.title AS position_title
      FROM timesheets t
      JOIN positions p ON t.pos_id = p.pos_id
      WHERE t.emp_id = $1 AND t.date_work = $2
      ORDER BY t.pos_id;
    `;
    const { rows } = await db.query(query, [emp_id, date_work]);
    return rows;
  }

  /**
   * Получает все отметки для конкретного сотрудника за месяц.
   * @param {Object} db - Объект подключения к БД.
   * @param {string} emp_id - ID сотрудника.
   * @param {string} monthDate - Дата в формате 'YYYY-MM'.
   * @returns {Array} - Массив отметок.
   */
  async getTimesheetsByEmpAndMonth(db, emp_id, monthDate) {
    const query = `
      SELECT t.*, p.title AS position_title
      FROM timesheets t
      JOIN positions p ON t.pos_id = p.pos_id
      WHERE t.emp_id = $1 AND t.date_work >= $2::date AND t.date_work < ($2::date + interval '1 month')
      ORDER BY t.date_work, t.pos_id;
    `;
    const { rows } = await db.query(query, [emp_id, `${monthDate}-01`]);
    return rows;
  }
}

export default new TimesheetService();