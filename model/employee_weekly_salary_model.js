// model/employee_weekly_salary_model.js

const db = require('../config/db');

/**
 * Helper to convert value - returns number if exists, empty string if null/undefined
 * If user entered 0, it shows 0. If no data entered, shows ""
 */
const toNumOrEmpty = (val) => {
    if (val === null || val === undefined) return "";
    return parseFloat(val);
};

/**
 * Helper function to format employee row data
 * Shows empty "" when no data entered, shows actual value (including 0) when user entered it
 */
const formatEmployeeRow = (row) => {
    // Check if this employee has a salary record for this week
    const hasRecord = row.salary_record_id !== null;

    return {
        employee_id: row.employee_id,
        employee_name: row.employee_name,
        daily_salary: parseFloat(row.daily_salary) || 0,
        salary_record_id: row.salary_record_id || null,
        week_start_date: row.week_start_date ? (typeof row.week_start_date === 'string' ? row.week_start_date : row.week_start_date.toISOString().split('T')[0]) : null,
        week_end_date: row.week_end_date ? (typeof row.week_end_date === 'string' ? row.week_end_date : row.week_end_date.toISOString().split('T')[0]) : null,
        mon_days: hasRecord ? toNumOrEmpty(row.mon_days) : "",
        mon_ot: hasRecord ? toNumOrEmpty(row.mon_ot) : "",
        tue_days: hasRecord ? toNumOrEmpty(row.tue_days) : "",
        tue_ot: hasRecord ? toNumOrEmpty(row.tue_ot) : "",
        wed_days: hasRecord ? toNumOrEmpty(row.wed_days) : "",
        wed_ot: hasRecord ? toNumOrEmpty(row.wed_ot) : "",
        thu_days: hasRecord ? toNumOrEmpty(row.thu_days) : "",
        thu_ot: hasRecord ? toNumOrEmpty(row.thu_ot) : "",
        fri_days: hasRecord ? toNumOrEmpty(row.fri_days) : "",
        fri_ot: hasRecord ? toNumOrEmpty(row.fri_ot) : "",
        sat_days: hasRecord ? toNumOrEmpty(row.sat_days) : "",
        sat_ot: hasRecord ? toNumOrEmpty(row.sat_ot) : "",
        sun_days: hasRecord ? toNumOrEmpty(row.sun_days) : "",
        sun_ot: hasRecord ? toNumOrEmpty(row.sun_ot) : "",
        total_days: hasRecord ? toNumOrEmpty(row.total_days) : "",
        total_ot: hasRecord ? toNumOrEmpty(row.total_ot) : "",
        total_salary: hasRecord ? toNumOrEmpty(row.total_salary) : ""
    };
};

const EmployeeWeeklySalaryModel = {

    /**
     * Get Monday of current week
     */
    getCurrentWeekMonday: () => {
        const today = new Date();
        const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().split('T')[0];
    },

    /**
     * Get Sunday of current week
     */
    getCurrentWeekSunday: () => {
        const today = new Date();
        const day = today.getDay();
        const diff = day === 0 ? 0 : 7 - day; // If Sunday, stay; else go forward
        const sunday = new Date(today);
        sunday.setDate(today.getDate() + diff);
        sunday.setHours(0, 0, 0, 0);
        return sunday.toISOString().split('T')[0];
    },

    /**
     * Get current week data for all employees
     * Returns all employees with their weekly salary data (empty slots if no data)
     */
    getCurrentWeekData: async () => {
        const weekStart = EmployeeWeeklySalaryModel.getCurrentWeekMonday();
        const weekEnd = EmployeeWeeklySalaryModel.getCurrentWeekSunday();

        const query = `
            SELECT 
                e.id AS employee_id,
                e.name AS employee_name,
                e.daily_salary,
                ews.id AS salary_record_id,
                ews.week_start_date,
                ews.week_end_date,
                ews.mon_days,
                ews.mon_ot,
                ews.tue_days,
                ews.tue_ot,
                ews.wed_days,
                ews.wed_ot,
                ews.thu_days,
                ews.thu_ot,
                ews.fri_days,
                ews.fri_ot,
                ews.sat_days,
                ews.sat_ot,
                ews.sun_days,
                ews.sun_ot,
                ews.total_days,
                ews.total_ot,
                ews.total_salary
            FROM employees e
            LEFT JOIN employee_weekly_salary ews 
                ON e.id = ews.employee_id 
                AND ews.week_start_date = ?
            ORDER BY e.name ASC
        `;

        const [rows] = await db.query(query, [weekStart]);

        return {
            week_start_date: weekStart,
            week_end_date: weekEnd,
            employees: rows.map(formatEmployeeRow)
        };
    },


    /**
     * Bulk save/update weekly salary data for multiple employees
     * @param {Array} employeesData - Array of employee salary data
     */
    bulkSaveWeeklySalary: async (employeesData) => {
        const weekStart = EmployeeWeeklySalaryModel.getCurrentWeekMonday();
        const weekEnd = EmployeeWeeklySalaryModel.getCurrentWeekSunday();

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const results = [];

            for (const emp of employeesData) {
                const {
                    employee_id,
                    daily_salary,
                    mon_days = 0, mon_ot = 0,
                    tue_days = 0, tue_ot = 0,
                    wed_days = 0, wed_ot = 0,
                    thu_days = 0, thu_ot = 0,
                    fri_days = 0, fri_ot = 0,
                    sat_days = 0, sat_ot = 0,
                    sun_days = 0, sun_ot = 0
                } = emp;

                // Calculate totals
                const total_days = parseFloat(mon_days) + parseFloat(tue_days) + parseFloat(wed_days) +
                    parseFloat(thu_days) + parseFloat(fri_days) + parseFloat(sat_days) +
                    parseFloat(sun_days);

                const total_ot = parseFloat(mon_ot) + parseFloat(tue_ot) + parseFloat(wed_ot) +
                    parseFloat(thu_ot) + parseFloat(fri_ot) + parseFloat(sat_ot) +
                    parseFloat(sun_ot);

                // Calculate salary: (days * daily_salary) + (ot_hours * (daily_salary/10))
                const perHour = parseFloat(daily_salary) / 10;
                const total_salary = (total_days * parseFloat(daily_salary)) + (total_ot * perHour);

                // Upsert query (INSERT or UPDATE if exists)
                const query = `
                    INSERT INTO employee_weekly_salary (
                        employee_id, week_start_date, week_end_date,
                        mon_days, mon_ot, tue_days, tue_ot, wed_days, wed_ot,
                        thu_days, thu_ot, fri_days, fri_ot, sat_days, sat_ot,
                        sun_days, sun_ot, total_days, total_ot, total_salary
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        mon_days = VALUES(mon_days), mon_ot = VALUES(mon_ot),
                        tue_days = VALUES(tue_days), tue_ot = VALUES(tue_ot),
                        wed_days = VALUES(wed_days), wed_ot = VALUES(wed_ot),
                        thu_days = VALUES(thu_days), thu_ot = VALUES(thu_ot),
                        fri_days = VALUES(fri_days), fri_ot = VALUES(fri_ot),
                        sat_days = VALUES(sat_days), sat_ot = VALUES(sat_ot),
                        sun_days = VALUES(sun_days), sun_ot = VALUES(sun_ot),
                        total_days = VALUES(total_days), total_ot = VALUES(total_ot),
                        total_salary = VALUES(total_salary),
                        updated_at = CURRENT_TIMESTAMP
                `;

                const [result] = await connection.query(query, [
                    employee_id, weekStart, weekEnd,
                    mon_days, mon_ot, tue_days, tue_ot, wed_days, wed_ot,
                    thu_days, thu_ot, fri_days, fri_ot, sat_days, sat_ot,
                    sun_days, sun_ot, total_days, total_ot, total_salary
                ]);

                results.push({
                    employee_id,
                    total_days,
                    total_ot,
                    total_salary,
                    affected: result.affectedRows
                });
            }

            await connection.commit();
            return { success: true, week_start_date: weekStart, week_end_date: weekEnd, results };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Get past weeks salary history
     * @param {number} limit - Number of past weeks to fetch
     */
    getPastWeeksHistory: async (limit = 10) => {
        const currentWeekStart = EmployeeWeeklySalaryModel.getCurrentWeekMonday();

        const query = `
            SELECT DISTINCT week_start_date, week_end_date
            FROM employee_weekly_salary
            WHERE week_start_date < ?
            ORDER BY week_start_date DESC
            LIMIT ?
        `;

        const [weeks] = await db.query(query, [currentWeekStart, limit]);
        return weeks;
    },

    /**
     * Get salary data for a specific week
     * @param {string} weekStartDate - Monday date of the week (YYYY-MM-DD)
     */
    getWeekData: async (weekStartDate) => {
        const query = `
            SELECT 
                e.id AS employee_id,
                e.name AS employee_name,
                e.daily_salary,
                ews.id AS salary_record_id,
                ews.week_start_date,
                ews.week_end_date,
                ews.mon_days,
                ews.mon_ot,
                ews.tue_days,
                ews.tue_ot,
                ews.wed_days,
                ews.wed_ot,
                ews.thu_days,
                ews.thu_ot,
                ews.fri_days,
                ews.fri_ot,
                ews.sat_days,
                ews.sat_ot,
                ews.sun_days,
                ews.sun_ot,
                ews.total_days,
                ews.total_ot,
                ews.total_salary
            FROM employees e
            LEFT JOIN employee_weekly_salary ews 
                ON e.id = ews.employee_id 
                AND ews.week_start_date = ?
            ORDER BY e.name ASC
        `;

        const [rows] = await db.query(query, [weekStartDate]);

        // Calculate week end date (Sunday = Monday + 6 days)
        const startDate = new Date(weekStartDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        return {
            week_start_date: weekStartDate,
            week_end_date: endDate.toISOString().split('T')[0],
            employees: rows.map(formatEmployeeRow)
        };
    }
};

module.exports = EmployeeWeeklySalaryModel;
