// controller/employee_weekly_salary_controller.js

const EmployeeWeeklySalaryModel = require('../model/employee_weekly_salary_model');
const { logUserActivity } = require('../utils/activityLogger');

const employeeWeeklySalaryController = {

    /**
     * Get current week salary data for all employees
     * GET /employee-weekly-salary/current
     */
    getCurrentWeekData: async (req, res) => {
        try {
            const data = await EmployeeWeeklySalaryModel.getCurrentWeekData();

            res.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            console.error('Error in getCurrentWeekData:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    },

    /**
     * Bulk save/update weekly salary for multiple employees
     * POST /employee-weekly-salary/bulk-save
     * Body: { employees: [{ employee_id, daily_salary, mon_days, mon_ot, ... }] }
     */
    bulkSaveWeeklySalary: async (req, res) => {
        try {
            const { employees } = req.body;

            if (!employees || !Array.isArray(employees) || employees.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'employees array is required'
                });
            }

            // Validate each employee entry
            for (const emp of employees) {
                if (!emp.employee_id || !emp.daily_salary) {
                    return res.status(400).json({
                        success: false,
                        message: 'Each employee must have employee_id and daily_salary'
                    });
                }
            }

            const result = await EmployeeWeeklySalaryModel.bulkSaveWeeklySalary(employees);

            // Log activity
            await logUserActivity(req, {
                model_name: 'employee_weekly_salary',
                action_type: 'BULK_UPDATE',
                record_id: null,
                description: `Bulk updated weekly salary for ${employees.length} employees (Week: ${result.week_start_date})`
            });

            res.status(200).json({
                success: true,
                message: `Successfully saved salary data for ${employees.length} employees`,
                data: result
            });
        } catch (error) {
            console.error('Error in bulkSaveWeeklySalary:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    },

    /**
     * Get past weeks history
     * GET /employee-weekly-salary/history?limit=10
     */
    getPastWeeksHistory: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const weeks = await EmployeeWeeklySalaryModel.getPastWeeksHistory(limit);

            res.status(200).json({
                success: true,
                data: weeks
            });
        } catch (error) {
            console.error('Error in getPastWeeksHistory:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    },

    /**
     * Get salary data for a specific week
     * GET /employee-weekly-salary/week/:weekStartDate
     */
    getWeekData: async (req, res) => {
        try {
            const { weekStartDate } = req.params;

            if (!weekStartDate) {
                return res.status(400).json({
                    success: false,
                    message: 'weekStartDate parameter is required (YYYY-MM-DD)'
                });
            }

            const data = await EmployeeWeeklySalaryModel.getWeekData(weekStartDate);

            res.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            console.error('Error in getWeekData:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    },

    /**
     * Get all weeks data (current + past)
     * GET /employee-weekly-salary/all-weeks
     */
    getAllWeeksData: async (req, res) => {
        try {
            const data = await EmployeeWeeklySalaryModel.getAllWeeksData();

            res.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            console.error('Error in getAllWeeksData:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    }
};

module.exports = employeeWeeklySalaryController;
