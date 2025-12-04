// model/employee_model.js

const db = require('../config/db'); // Assuming the database connection is available here

const EmployeeModel = {
  
  // --- EMPLOYEE (Master Data) METHODS ---

  /**
   * Creates a new employee record.
   * @param {object} employeeData - Data for the new employee.
   * @returns {object} The created employee object.
   */
  createEmployee: async (employeeData) => {
    const columns = Object.keys(employeeData);
    const values = Object.values(employeeData);
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO employees (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...employeeData };
  },

  /**
   * Retrieves an employee by ID.
   * @param {number} id - Employee ID.
   * @returns {object|null} The employee record.
   */
  getEmployeeById: async (id) => {
    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  },

  /**
   * Retrieves an employee's daily salary by ID (Crucial for calculation).
   * @param {number} id - Employee ID.
   * @returns {number|null} The daily_salary amount.
   */
  getEmployeeDailySalary: async (id) => {
    // Only select the daily_salary field
    const [rows] = await db.query('SELECT daily_salary FROM employees WHERE id = ?', [id]);
    // Return the salary as a float, or null if not found
    return rows.length > 0 ? parseFloat(rows[0].daily_salary) : null;
  },

  /**
   * Retrieves all active employees.
   * @returns {Array<object>} List of employees.
   */
  getAllEmployees: async () => {
    // Note: Assuming 'is_active = 1' is used for active employees
    const [rows] = await db.query('SELECT * FROM employees');
    return rows;
  },
  
  /**
   * Updates an existing employee record.
   * @param {number} id - Employee ID.
   * @param {object} updateData - Data to update.
   * @returns {number} Number of affected rows (0 or 1).
   */
  updateEmployee: async (id, updateData) => {
    // Safety check: ensure there are fields to update
    const updateKeys = Object.keys(updateData);
    if (updateKeys.length === 0) {
      throw new Error('No fields provided to update');
    }

    const updates = updateKeys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];
    const query = `UPDATE employees SET ${updates} WHERE id = ?`;
    const [result] = await db.query(query, values);
    return result.affectedRows;
  },

  /**
   * Deletes an employee record and all related records (work records and advances).
   * @param {number} id - Employee ID.
   * @returns {number} Number of affected rows (0 or 1).
   */
  deleteEmployee: async (id) => {
    // Start a transaction to ensure all deletions succeed or fail together
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Delete all work records for this employee
      await connection.query('DELETE FROM employee_work_records WHERE employee_id = ?', [id]);

      // 2. Delete all advances for this employee
      await connection.query('DELETE FROM employee_advances WHERE employee_id = ?', [id]);

      // 3. Delete the employee record
      const [result] = await connection.query('DELETE FROM employees WHERE id = ?', [id]);

      // Commit the transaction
      await connection.commit();
      
      return result.affectedRows;
    } catch (error) {
      // Rollback the transaction on error
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  },


  // --- WORK RECORDS (Daily Salary Tracking) METHODS ---

  /**
   * Retrieves all work records.
   * @returns {Array<object>} List of all employee work records.
   */
  getAllWorkRecords: async () => {
    const [rows] = await db.query('SELECT * FROM employee_work_records');
    return rows;
  },

  /**
   * Creates a new daily work record.
   * @param {object} recordData - Data for the work record, including daily_salary_paid.
   * @returns {object} The created record object.
   */
  createWorkRecord: async (recordData) => {
    const columns = Object.keys(recordData);
    const values = Object.values(recordData);
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO employee_work_records (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...recordData };
  },

  /**
   * Retrieves the total gross salary earned by an employee over a specific date range.
   * @param {number} employeeId - ID of the employee.
   * @param {string} startDate - Start date of the period (YYYY-MM-DD).
   * @param {string} endDate - End date of the period (YYYY-MM-DD).
   * @returns {number} The total sum of daily_salary_paid.
   */
  getGrossWeeklySalary: async (employeeId, startDate, endDate) => {
    const query = `
      SELECT SUM(daily_salary_paid) AS gross_salary
      FROM employee_work_records
      WHERE employee_id = ? AND work_date BETWEEN ? AND ?
    `;
    const [rows] = await db.query(query, [employeeId, startDate, endDate]);
    // Return 0 if no records are found
    return rows.length > 0 && rows[0].gross_salary !== null ? parseFloat(rows[0].gross_salary) : 0;
  },

  /**
   * Retrieves daily work records for an employee over a specific date range.
   * @param {number} employeeId - ID of the employee.
   * @param {string} startDate - Start date of the period (YYYY-MM-DD).
   * @param {string} endDate - End date of the period (YYYY-MM-DD).
   * @returns {Array<object>} List of daily work records ordered by date.
   */
  getDailyWorkRecords: async (employeeId, startDate, endDate) => {
    const query = `
      SELECT 
        id,
        work_date,
        working_hours,
        overtime_hours,
        daily_salary_paid
      FROM employee_work_records
      WHERE employee_id = ? AND work_date BETWEEN ? AND ?
      ORDER BY work_date ASC
    `;
    const [rows] = await db.query(query, [employeeId, startDate, endDate]);
    return rows;
  },

  /**
   * Updates an existing work record for an employee on a specific date.
   * @param {number} employeeId - ID of the employee.
   * @param {string} workDate - Work date (YYYY-MM-DD).
   * @param {object} updateData - Data to update.
   * @returns {number} Number of affected rows.
   */
  updateWorkRecord: async (employeeId, workDate, updateData) => {
    const updates = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), employeeId, workDate];
    const query = `UPDATE employee_work_records SET ${updates} WHERE employee_id = ? AND work_date = ?`;
    const [result] = await db.query(query, values);
    return result.affectedRows;
  },

  /**
   * Gets all unique weeks (Monday to Sunday) that have work records.
   * @returns {Array<object>} List of weeks with start and end dates.
   */
  getAllSalaryWeeks: async () => {
    // Get all unique dates from work records
    const query = `
      SELECT DISTINCT work_date 
      FROM employee_work_records 
      ORDER BY work_date DESC
    `;
    const [rows] = await db.query(query);
    
    // Group dates into weeks (Monday to Sunday)
    const weekMap = new Map();
    
    rows.forEach(row => {
      const date = new Date(row.work_date);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Get Monday of the week
      const monday = new Date(date);
      monday.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
      monday.setHours(0, 0, 0, 0);
      const weekStart = monday.toISOString().split('T')[0];
      
      // Calculate Sunday (end of week)
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const weekEnd = sunday.toISOString().split('T')[0];
      
      if (!weekMap.has(weekStart)) {
        weekMap.set(weekStart, {
          week_start: weekStart,
          week_end: weekEnd,
          week_number: weekMap.size + 1
        });
      }
    });
    
    // Convert map to array and sort by date (most recent first)
    return Array.from(weekMap.values()).sort((a, b) => 
      new Date(b.week_start) - new Date(a.week_start)
    );
  },


  // --- ADVANCES (Deduction Tracking) METHODS ---

  /**
   * Creates a new salary advance record.
   * @param {object} advanceData - Data for the advance record.
   * @returns {object} The created advance object.
   */
  createAdvance: async (advanceData) => {
    const columns = Object.keys(advanceData);
    const values = Object.values(advanceData);
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO employee_advances (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...advanceData };
  },

  /**
   * Retrieves the total amount of undeducted advances for an employee.
   * @param {number} employeeId - ID of the employee.
   * @returns {number} The total sum of undeducted advances.
   */
  getTotalUndeductedAdvances: async (employeeId) => {
    const query = `
      SELECT SUM(amount) AS total_advance
      FROM employee_advances
      WHERE employee_id = ? AND deducted = 0
    `;
    const [rows] = await db.query(query, [employeeId]);
    return rows.length > 0 && rows[0].total_advance !== null ? parseFloat(rows[0].total_advance) : 0;
  },

  /**
   * Marks all pending advances for an employee as deducted.
   * This should be called after a successful salary payment.
   * @param {number} employeeId - ID of the employee.
   * @returns {number} Number of affected rows.
   */
  markAdvancesAsDeducted: async (employeeId) => {
    const query = `
      UPDATE employee_advances
      SET deducted = 1
      WHERE employee_id = ? AND deducted = 0
    `;
    const [result] = await db.query(query, [employeeId]);
    return result.affectedRows;
  }
};

module.exports = EmployeeModel;