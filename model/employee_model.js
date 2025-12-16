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
   * Retrieves all active employees with their advance balance.
   * @returns {Array<object>} List of employees with advance_balance.
   */
  getAllEmployees: async () => {
    const query = `
      SELECT 
        e.*,
        COALESCE(SUM(ea.remaining_balance), 0) as advance_balance
      FROM employees e
      LEFT JOIN employee_advances ea ON e.id = ea.employee_id AND ea.status IN ('PENDING', 'PARTIAL')
      GROUP BY e.id
      ORDER BY e.name ASC
    `;
    const [rows] = await db.query(query);
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
   * Gets all unique weeks (Saturday to Friday) that have work records.
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

    // Group dates into weeks (Saturday to Friday)
    const weekMap = new Map();

    rows.forEach(row => {
      const date = new Date(row.work_date);
      const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      // Calculate days to subtract to get to Saturday
      // Saturday (6): 0 days
      // Sunday (0): -1 day (go back 1)
      // Monday (1): -2 days (go back 2)
      // Tuesday (2): -3 days (go back 3)
      // Wednesday (3): -4 days (go back 4)
      // Thursday (4): -5 days (go back 5)
      // Friday (5): -6 days (go back 6)
      const daysToSaturday = day === 6 ? 0 : -(day + 1);
      const saturday = new Date(date);
      saturday.setDate(date.getDate() + daysToSaturday);
      saturday.setHours(0, 0, 0, 0);
      const weekStart = saturday.toISOString().split('T')[0];

      // Calculate Friday (end of week = Saturday + 6 days)
      const friday = new Date(saturday);
      friday.setDate(saturday.getDate() + 6);
      const weekEnd = friday.toISOString().split('T')[0];

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
  },

  // --- NEW ADVANCE PAYMENT SYSTEM (Independent from Salary) ---

  /**
   * Creates a new advance payment for an employee
   * @param {object} advanceData - { employee_id, amount, reason, date, created_by }
   * @returns {object} The created advance record
   */
  createAdvancePayment: async (advanceData) => {
    const { employee_id, amount, reason, date, created_by } = advanceData;
    const query = `
      INSERT INTO employee_advances (employee_id, amount, remaining_balance, reason, date, status, created_by)
      VALUES (?, ?, ?, ?, ?, 'PENDING', ?)
    `;
    const [result] = await db.query(query, [employee_id, amount, amount, reason, date, created_by]);
    return { id: result.insertId, ...advanceData, remaining_balance: amount, status: 'PENDING' };
  },

  /**
   * Get all advances for an employee
   * @param {number} employeeId - Employee ID
   * @returns {array} List of all advances
   */
  getEmployeeAdvances: async (employeeId) => {
    const query = `
      SELECT 
        ea.id,
        ea.employee_id,
        ea.amount,
        ea.remaining_balance,
        ea.reason,
        ea.date,
        ea.status,
        ea.created_at,
        ea.updated_at,
        COUNT(ear.id) as repayment_count,
        COALESCE(SUM(ear.amount), 0) as total_repaid
      FROM employee_advances ea
      LEFT JOIN employee_advance_repayments ear ON ea.id = ear.advance_id
      WHERE ea.employee_id = ?
      GROUP BY ea.id
      ORDER BY ea.date DESC
    `;
    const [rows] = await db.query(query, [employeeId]);
    return rows;
  },

  /**
   * Get advance details with repayment history
   * @param {number} advanceId - Advance ID
   * @returns {object} Advance details with repayments
   */
  getAdvanceDetails: async (advanceId) => {
    const query = `
      SELECT 
        ea.id,
        ea.employee_id,
        ea.amount,
        ea.remaining_balance,
        ea.reason,
        ea.date,
        ea.status,
        ea.created_at,
        e.name as employee_name,
        e.mobile as employee_mobile
      FROM employee_advances ea
      LEFT JOIN employees e ON ea.employee_id = e.id
      WHERE ea.id = ?
    `;
    const [rows] = await db.query(query, [advanceId]);

    if (rows.length === 0) return null;

    // Get repayment history
    const repaymentQuery = `
      SELECT id, amount, date, notes, created_at
      FROM employee_advance_repayments
      WHERE advance_id = ?
      ORDER BY date DESC
    `;
    const [repayments] = await db.query(repaymentQuery, [advanceId]);

    return { ...rows[0], repayments };
  },

  /**
   * Add repayment for an advance
   * @param {object} repaymentData - { advance_id, employee_id, amount, date, notes, created_by }
   * @returns {object} The created repayment record
   */
  addAdvanceRepayment: async (repaymentData) => {
    const { advance_id, employee_id, amount, date, notes, created_by } = repaymentData;

    // Start transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert repayment
      const repaymentQuery = `
        INSERT INTO employee_advance_repayments (advance_id, employee_id, amount, date, notes, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await connection.query(repaymentQuery, [advance_id, employee_id, amount, date, notes, created_by]);

      // Update advance remaining balance and status
      const updateQuery = `
        UPDATE employee_advances
        SET remaining_balance = remaining_balance - ?,
            status = CASE 
              WHEN (remaining_balance - ?) <= 0 THEN 'PAID'
              WHEN (remaining_balance - ?) < amount THEN 'PARTIAL'
              ELSE 'PARTIAL'
            END,
            updated_at = NOW()
        WHERE id = ?
      `;
      await connection.query(updateQuery, [amount, amount, amount, advance_id]);

      await connection.commit();
      return { id: result.insertId, ...repaymentData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.release();
    }
  },

  /**
   * Get repayment history for an advance
   * @param {number} advanceId - Advance ID
   * @returns {array} List of repayments
   */
  getAdvanceRepayments: async (advanceId) => {
    const query = `
      SELECT 
        id,
        amount,
        date,
        notes,
        created_at
      FROM employee_advance_repayments
      WHERE advance_id = ?
      ORDER BY date DESC
    `;
    const [rows] = await db.query(query, [advanceId]);
    return rows;
  },

  /**
   * Get total pending advances for an employee
   * @param {number} employeeId - Employee ID
   * @returns {object} Summary of advances
   */
  getEmployeeAdvanceSummary: async (employeeId) => {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(remaining_balance), 0) as total_remaining_balance,
        COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END), 0) as paid_amount,
        COUNT(CASE WHEN status IN ('PENDING', 'PARTIAL') THEN 1 END) as active_advances
      FROM employee_advances
      WHERE employee_id = ?
    `;
    const [rows] = await db.query(query, [employeeId]);
    return rows[0] || { pending_amount: 0, total_remaining_balance: 0, paid_amount: 0, active_advances: 0 };
  },

  /**
   * Simple repayment - just employee_id and amount
   * Automatically deducts from oldest pending advances first (FIFO)
   * @param {object} repaymentData - { employee_id, amount, date, notes, created_by }
   * @returns {object} Result with repayment details
   */
  addSimpleRepayment: async (repaymentData) => {
    const { employee_id, amount, date, notes, created_by } = repaymentData;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get all pending/partial advances for this employee (oldest first)
      const [advances] = await connection.query(`
        SELECT id, remaining_balance 
        FROM employee_advances 
        WHERE employee_id = ? AND status IN ('PENDING', 'PARTIAL') AND remaining_balance > 0
        ORDER BY date ASC, id ASC
      `, [employee_id]);

      let remainingAmount = parseFloat(amount);
      const affectedAdvances = [];

      // Deduct from advances (FIFO - oldest first)
      for (const advance of advances) {
        if (remainingAmount <= 0) break;

        const deductAmount = Math.min(remainingAmount, parseFloat(advance.remaining_balance));
        const newBalance = parseFloat(advance.remaining_balance) - deductAmount;
        const newStatus = newBalance <= 0 ? 'PAID' : 'PARTIAL';

        // Update this advance
        await connection.query(`
          UPDATE employee_advances 
          SET remaining_balance = ?, status = ?, updated_at = NOW()
          WHERE id = ?
        `, [newBalance, newStatus, advance.id]);

        // Record repayment for this advance
        await connection.query(`
          INSERT INTO employee_advance_repayments (advance_id, employee_id, amount, date, notes, created_by)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [advance.id, employee_id, deductAmount, date, notes, created_by]);

        affectedAdvances.push({ advance_id: advance.id, deducted: deductAmount });
        remainingAmount -= deductAmount;
      }

      await connection.commit();

      return {
        repayment_id: Date.now(), // Just for reference
        total_deducted: parseFloat(amount),
        affected_advances: affectedAdvances
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Get employee advance statement (bank statement style)
   * Shows all advances and repayments in date order with running balance
   * @param {number} employeeId - Employee ID
   * @returns {object} Statement with transactions and totals
   */
  getEmployeeAdvanceStatement: async (employeeId) => {
    // Get all advances
    const [advances] = await db.query(`
      SELECT 
        'ADVANCE' as type,
        id,
        date,
        amount,
        reason as description,
        created_at
      FROM employee_advances
      WHERE employee_id = ?
    `, [employeeId]);

    // Get all repayments
    const [repayments] = await db.query(`
      SELECT 
        'REPAYMENT' as type,
        id,
        date,
        amount,
        notes as description,
        created_at
      FROM employee_advance_repayments
      WHERE employee_id = ?
    `, [employeeId]);

    // Combine and sort by date
    const allTransactions = [...advances, ...repayments];
    allTransactions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() === dateB.getTime()) {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return dateA - dateB;
    });

    // Calculate running balance
    let runningBalance = 0;
    let totalAdvance = 0;
    let totalRepaid = 0;

    const transactions = allTransactions.map(t => {
      const amount = parseFloat(t.amount);
      if (t.type === 'ADVANCE') {
        runningBalance += amount;
        totalAdvance += amount;
      } else {
        runningBalance -= amount;
        totalRepaid += amount;
      }

      return {
        type: t.type,
        date: t.date,
        description: t.description || (t.type === 'ADVANCE' ? 'Advance taken' : 'Repayment'),
        advance: t.type === 'ADVANCE' ? amount : 0,
        repayment: t.type === 'REPAYMENT' ? amount : 0,
        balance: runningBalance
      };
    });

    return {
      transactions,
      total_advance: totalAdvance,
      total_repaid: totalRepaid,
      current_balance: runningBalance
    };
  }
};

module.exports = EmployeeModel;