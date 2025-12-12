// route/employee_weekly_salary_route.js

const express = require('express');
const router = express.Router();
const employeeWeeklySalaryController = require('../controller/employee_weekly_salary_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// All routes require authentication
router.use(authMiddleware);

const permission = 'employees';

// Get current week salary data for all employees
// GET /employee-weekly-salary/current
router.get('/current', checkPermission(permission), employeeWeeklySalaryController.getCurrentWeekData);

// Bulk save/update weekly salary for multiple employees
// POST /employee-weekly-salary/bulk-save
router.post('/bulk-save', checkPermission(permission), employeeWeeklySalaryController.bulkSaveWeeklySalary);

// Get past weeks history list
// GET /employee-weekly-salary/history?limit=10
router.get('/history', checkPermission(permission), employeeWeeklySalaryController.getPastWeeksHistory);

// Get salary data for a specific week
// GET /employee-weekly-salary/week/2024-12-09
router.get('/week/:weekStartDate', checkPermission(permission), employeeWeeklySalaryController.getWeekData);

module.exports = router;
