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

    // Calculate total_hours = (total_days * 10) + total_ot
    const totalDays = hasRecord ? (parseFloat(row.total_days) || 0) : 0;
    const totalOt = hasRecord ? (parseFloat(row.total_ot) || 0) : 0;
    const totalHours = (totalDays * 10) + totalOt;

    return {
        employee_id: row.employee_id,
        employee_name: row.employee_name,
        daily_salary: parseFloat(row.daily_salary) || 0,
        salary_record_id: row.salary_record_id || null,
        week_start_date: row.week_start_date ? (typeof row.week_start_date === 'string' ? row.week_start_date : row.week_start_date.toISOString().split('T')[0]) : null,
        week_end_date: row.week_end_date ? (typeof row.week_end_date === 'string' ? row.week_end_date : row.week_end_date.toISOString().split('T')[0]) : null,
        // Week order: Sat, Sun, Mon, Tue, Wed, Thu, Fri
        sat_days: hasRecord ? toNumOrEmpty(row.sat_days) : "",
        sat_ot: hasRecord ? toNumOrEmpty(row.sat_ot) : "",
        sun_days: hasRecord ? toNumOrEmpty(row.sun_days) : "",
        sun_ot: hasRecord ? toNumOrEmpty(row.sun_ot) : "",
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
        total_days: hasRecord ? toNumOrEmpty(row.total_days) : "",
        total_ot: hasRecord ? toNumOrEmpty(row.total_ot) : "",
        total_hours: hasRecord ? totalHours : "",
        total_salary: hasRecord ? toNumOrEmpty(row.total_salary) : ""
    };
};

const EmployeeWeeklySalaryModel = {

    /**
     * Format date as YYYY-MM-DD (local timezone)
     */
    formatDate: (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Get Saturday (start) of current week
     * Week: Saturday to Friday
     */
    getCurrentWeekStart: () => {
        const today = new Date();
        const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        // Calculate days to go back to Saturday
        // Sat(6)=0, Sun(0)=1, Mon(1)=2, Tue(2)=3, Wed(3)=4, Thu(4)=5, Fri(5)=6
        const diff = day === 6 ? 0 : -(day + 1);
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + diff);
        return EmployeeWeeklySalaryModel.formatDate(saturday);
    },

    /**
     * Get Friday (end) of current week
     * Week: Saturday to Friday
     */
    getCurrentWeekEnd: () => {
        const today = new Date();
        const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        // Calculate days to go forward to Friday
        // Sat(6)=6, Sun(0)=5, Mon(1)=4, Tue(2)=3, Wed(3)=2, Thu(4)=1, Fri(5)=0
        const diff = day === 6 ? 6 : (5 - day);
        const friday = new Date(today);
        friday.setDate(today.getDate() + diff);
        return EmployeeWeeklySalaryModel.formatDate(friday);
    },

    /**
     * Get current week data for all employees
     * Returns all employees with their weekly salary data (empty slots if no data)
     */
    getCurrentWeekData: async () => {
        const weekStart = EmployeeWeeklySalaryModel.getCurrentWeekStart();
        const weekEnd = EmployeeWeeklySalaryModel.getCurrentWeekEnd();

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
     * Helper to safely parse number, returns 0 for null/undefined/NaN
     */
    safeNum: (val) => {
        if (val === null || val === undefined || val === '' || val === "") return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    },

    /**
     * Bulk save/update weekly salary data for multiple employees
     * @param {Array} employeesData - Array of employee salary data
     */
    bulkSaveWeeklySalary: async (employeesData) => {
        const weekStart = EmployeeWeeklySalaryModel.getCurrentWeekStart();
        const weekEnd = EmployeeWeeklySalaryModel.getCurrentWeekEnd();
        const safeNum = EmployeeWeeklySalaryModel.safeNum;

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const results = [];

            for (const emp of employeesData) {
                const employee_id = emp.employee_id;
                const daily_salary = safeNum(emp.daily_salary);

                // Safely parse all day values
                const mon_days = safeNum(emp.mon_days);
                const mon_ot = safeNum(emp.mon_ot);
                const tue_days = safeNum(emp.tue_days);
                const tue_ot = safeNum(emp.tue_ot);
                const wed_days = safeNum(emp.wed_days);
                const wed_ot = safeNum(emp.wed_ot);
                const thu_days = safeNum(emp.thu_days);
                const thu_ot = safeNum(emp.thu_ot);
                const fri_days = safeNum(emp.fri_days);
                const fri_ot = safeNum(emp.fri_ot);
                const sat_days = safeNum(emp.sat_days);
                const sat_ot = safeNum(emp.sat_ot);
                const sun_days = safeNum(emp.sun_days);
                const sun_ot = safeNum(emp.sun_ot);

                // Calculate totals
                const total_days = mon_days + tue_days + wed_days + thu_days + fri_days + sat_days + sun_days;
                const total_ot = mon_ot + tue_ot + wed_ot + thu_ot + fri_ot + sat_ot + sun_ot;

                // Calculate salary: (days * daily_salary) + (ot_hours * (daily_salary/10))
                const perHour = daily_salary / 10;
                const total_salary = (total_days * daily_salary) + (total_ot * perHour);

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
        const currentWeekStart = EmployeeWeeklySalaryModel.getCurrentWeekStart();

        const query = `
            SELECT DISTINCT 
                DATE_FORMAT(week_start_date, '%Y-%m-%d') AS week_start_date, 
                DATE_FORMAT(week_end_date, '%Y-%m-%d') AS week_end_date
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
        // Clean the date - extract just YYYY-MM-DD if timestamp is passed
        const cleanDate = weekStartDate.split('T')[0];

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

        const [rows] = await db.query(query, [cleanDate]);

        // Calculate week end date (Friday = Saturday + 6 days)
        const startDate = new Date(cleanDate + 'T00:00:00');
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        return {
            week_start_date: cleanDate,
            week_end_date: EmployeeWeeklySalaryModel.formatDate(endDate),
            employees: rows.map(formatEmployeeRow)
        };
    },

    /**
     * Get all past weeks data (excludes current week)
     * Returns past weeks in descending order (most recent first)
     */
    getAllWeeksData: async () => {
        const currentWeekStart = EmployeeWeeklySalaryModel.getCurrentWeekStart();

        // Get all unique past weeks from database (exclude current week)
        const weeksQuery = `
            SELECT DISTINCT 
                DATE_FORMAT(week_start_date, '%Y-%m-%d') AS week_start_date, 
                DATE_FORMAT(week_end_date, '%Y-%m-%d') AS week_end_date
            FROM employee_weekly_salary
            WHERE week_start_date < ?
            ORDER BY week_start_date DESC
        `;
        const [pastWeeks] = await db.query(weeksQuery, [currentWeekStart]);

        const allWeeks = [];

        // Add only past weeks data
        for (const week of pastWeeks) {
            const weekData = await EmployeeWeeklySalaryModel.getWeekData(week.week_start_date);
            allWeeks.push({
                week_start_date: week.week_start_date,
                week_end_date: week.week_end_date,
                is_current_week: false,
                employees: weekData.employees
            });
        }

        return allWeeks;
    }
};

module.exports = EmployeeWeeklySalaryModel;
