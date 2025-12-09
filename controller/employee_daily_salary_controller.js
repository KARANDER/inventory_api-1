const db = require('../config/db');
const EmployeeDailySalary = require('../model/employee_daily_salary_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

// helper: parse "1/2" etc.
function parseDayPart(day_part) {
  if (!day_part) return { full_days: 0, extra_hours: 0 };

  const parts = String(day_part).split('/');
  const full_days = parseInt(parts[0] || '0', 10) || 0;
  const extra_hours = parseInt(parts[1] || '0', 10) || 0;

  return { full_days, extra_hours };
}

async function getEmployeeRate(employee_id) {
  const query = `
    SELECT daily_salary
    FROM employees
    WHERE id = ?
    LIMIT 1
  `;
  const [rows] = await db.query(query, [employee_id]);
  const emp = rows[0];

  if (!emp) throw new Error('Employee not found');

  const STANDARD_DAILY_HOURS = 10;
  const hourly_rate = emp.daily_salary / STANDARD_DAILY_HOURS;

  return { hourly_rate, daily_salary: emp.daily_salary, standard_daily_hours: STANDARD_DAILY_HOURS };
}


const employeeDailySalaryController = {
  // POST /employeeDailySalary
  createRecord: async (req, res) => {
    try {
      const createdBy = req.user.id;

      const {
        employee_id,
        work_date,
        day_part,   // e.g. "1/0", "1/2", "0/3"
        remarks,
      } = req.body;

      if (!employee_id || !work_date || !day_part) {
        return res.status(400).json({
          success: false,
          message: 'employee_id, work_date and day_part are required',
        });
      }

      const { full_days, extra_hours } = parseDayPart(day_part);
      const { hourly_rate, standard_daily_hours } = await getEmployeeRate(employee_id);

      const total_hours = full_days * standard_daily_hours + extra_hours;
      const amount_for_day = Number((hourly_rate * total_hours).toFixed(2));

      const newData = {
        employee_id,
        work_date,
        day_part,
        full_days,
        extra_hours,
        total_hours,
        amount_for_day,
        remarks: remarks || null,
        created_by: createdBy,
      };

      const record = await EmployeeDailySalary.create(newData);

      await logUserActivity(req, {
        model_name: 'employee_daily_salary_records',
        action_type: 'CREATE',
        record_id: record.id,
        description: 'Created daily salary record',
      });

      res.status(201).json({
        success: true,
        data: record,
      });
    } catch (error) {
      console.error('Error in createRecord:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server Error',
      });
    }
  },

  // POST /employeeDailySalary/getAll
  getAllRecords: async (req, res) => {
    try {
      const { employee_id, start_date, end_date } = req.body;
      const records = await EmployeeDailySalary.findAll({
        employee_id,
        start_date,
        end_date,
      });

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  },

  // POST /employeeDailySalary/update
  updateRecord: async (req, res) => {
    try {
      const { id, ...data } = req.body;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Record id is required in body',
        });
      }

      const oldRecord = await EmployeeDailySalary.findById(id);
      if (!oldRecord) {
        return res.status(404).json({
          success: false,
          message: 'Record not found',
        });
      }

      // allow updating day_part, employee_id, work_date, remarks
      const employee_id = data.employee_id || oldRecord.employee_id;
      const day_part = data.day_part || oldRecord.day_part;
      const work_date = data.work_date || oldRecord.work_date;
      const remarks = data.remarks !== undefined ? data.remarks : oldRecord.remarks;

      const { full_days, extra_hours } = parseDayPart(day_part);
      const { hourly_rate, standard_daily_hours } = await getEmployeeRate(employee_id);

      const total_hours = full_days * standard_daily_hours + extra_hours;
      const amount_for_day = Number((hourly_rate * total_hours).toFixed(2));

      const updateData = {
        employee_id,
        work_date,
        day_part,
        full_days,
        extra_hours,
        total_hours,
        amount_for_day,
        remarks,
      };

      const affectedRows = await EmployeeDailySalary.update(id, updateData);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Record not found',
        });
      }

      const changes = compareChanges(oldRecord, updateData);

      await logUserActivity(req, {
        model_name: 'employee_daily_salary_records',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated daily salary record',
        changes,
      });

      res.status(200).json({
        success: true,
        message: 'Record updated successfully',
      });
    } catch (error) {
      console.error('Error in updateRecord:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  },

  // POST /employeeDailySalary/delete
  deleteRecord: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Record id is required in body',
        });
      }

      const affectedRows = await EmployeeDailySalary.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Record not found',
        });
      }

      await logUserActivity(req, {
        model_name: 'employee_daily_salary_records',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted daily salary record',
      });

      res.status(200).json({
        success: true,
        message: 'Record deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  },

  // POST /employeeDailySalary/getByEmployeeAndDateRange
  getByEmployeeAndDateRange: async (req, res) => {
    try {
      const { employee_id, start_date, end_date } = req.body;

      if (!employee_id || !start_date || !end_date) {
        return res.status(400).json({
          success: false,
          message: 'employee_id, start_date and end_date are required',
        });
      }

      const records = await EmployeeDailySalary.findAll({
        employee_id,
        start_date,
        end_date,
      });

      const summary = await EmployeeDailySalary.sumByEmployeeAndDateRange(
        employee_id,
        start_date,
        end_date
      );

      res.status(200).json({
        success: true,
        data: {
          records,
          summary,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  },
  getCurrentWeekSummary: async (req, res) => {
  try {
    const today = new Date();

    // JS getDay: 0=Sunday,1=Monday,...6=Saturday
    const day = today.getDay();
    const diffToMonday = (day + 6) % 7; // 0 if Monday, 1 if Tuesday, ... 6 if Sunday

    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // format as YYYY-MM-DD
    const toDateStr = (d) => d.toISOString().slice(0, 10);
    const week_start = toDateStr(monday);
    const week_end = toDateStr(sunday);

    // load all records in this week with employee name
    const rows = await EmployeeDailySalary.getWithEmployeeByDateRange(
      week_start,
      week_end
    );

    // group by employee_id
    const map = new Map();

    for (const row of rows) {
      const key = row.employee_id;
      if (!map.has(key)) {
        map.set(key, {
          employee_id: row.employee_id,
          employee_name: row.employee_name,
          records: [],
          summary: {
            total_hours: 0,
            total_amount: 0,
          },
        });
      }

      const emp = map.get(key);

      emp.records.push({
        id: row.id,
        work_date: row.work_date,
        day_part: row.day_part,
        full_days: row.full_days,
        extra_hours: row.extra_hours,
        total_hours: Number(row.total_hours),
        amount_for_day: Number(row.amount_for_day),
        remarks: row.remarks,
      });

      emp.summary.total_hours += Number(row.total_hours);
      emp.summary.total_amount += Number(row.amount_for_day);
    }

    const data = Array.from(map.values()).map((emp) => ({
      ...emp,
      summary: {
        total_hours: Number(emp.summary.total_hours.toFixed(2)),
        total_amount: Number(emp.summary.total_amount.toFixed(2)),
      },
    }));

    res.status(200).json({
      success: true,
      week_start,
      week_end,
      data,
    });
  } catch (error) {
    console.error('Error in getCurrentWeekSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
},
};

module.exports = employeeDailySalaryController;
