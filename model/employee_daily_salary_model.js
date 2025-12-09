const db = require('../config/db');

const EmployeeDailySalary = {
  create: async (data) => {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');

    const query = `
      INSERT INTO employee_daily_salary_records
      (${columns.join(', ')})
      VALUES (${placeholders})
    `;

    const [result] = await db.query(query, values);
    return { id: result.insertId, ...data };
  },

  findAll: async (filters = {}) => {
    const { employee_id, start_date, end_date } = filters;
    const where = [];
    const values = [];

    if (employee_id) {
      where.push('employee_id = ?');
      values.push(employee_id);
    }
    if (start_date) {
      where.push('work_date >= ?');
      values.push(start_date);
    }
    if (end_date) {
      where.push('work_date <= ?');
      values.push(end_date);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const query = `
      SELECT *
      FROM employee_daily_salary_records
      ${whereSql}
      ORDER BY work_date DESC, id DESC
    `;

    const [rows] = await db.query(query, values);
    return rows;
  },

  findById: async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM employee_daily_salary_records WHERE id = ?',
    [id]
  );
  return rows[0] || null;
},

  update: async (id, data) => {
    const updates = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const query = `
      UPDATE employee_daily_salary_records
      SET ${updates}
      WHERE id = ?
    `;

    const [result] = await db.query(query, values);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query(
      'DELETE FROM employee_daily_salary_records WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },

  sumByEmployeeAndDateRange: async (employee_id, start_date, end_date) => {
    const query = `
      SELECT
        COALESCE(SUM(total_hours), 0) AS total_hours,
        COALESCE(SUM(amount_for_day), 0) AS total_amount
      FROM employee_daily_salary_records
      WHERE employee_id = ?
        AND work_date BETWEEN ? AND ?
    `;
    const [rows] = await db.query(query, [employee_id, start_date, end_date]);
    return rows[0];
  },
  getWithEmployeeByDateRange: async (start_date, end_date) => {
  const query = `
    SELECT
      r.*,
      e.name AS employee_name
    FROM employee_daily_salary_records r
    JOIN employees e ON e.id = r.employee_id
    WHERE r.work_date BETWEEN ? AND ?
    ORDER BY r.employee_id, r.work_date, r.id
  `;
  const [rows] = await db.query(query, [start_date, end_date]);
  return rows;
},
};

module.exports = EmployeeDailySalary;
