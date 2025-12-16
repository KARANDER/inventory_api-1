// route/employee_advance_route.js

const express = require('express');
const router = express.Router();
const employeeAdvanceController = require('../controller/employee_advance_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// All routes for this module require authentication
router.use(authMiddleware);

// Define permission
const permission = 'employees';

/**
 * ============================================
 * EMPLOYEE ADVANCE PAYMENT ROUTES
 * ============================================
 */

/**
 * 1. Create an advance payment
 * POST: /employee-advances/create
 * Body: { employee_id, amount, reason, date }
 */
router.post(
  '/create',
  checkPermission(permission),
  employeeAdvanceController.createAdvance
);

/**
 * 2. Get all advances for an employee
 * POST: /employee-advances/getByEmployee
 * Body: { employee_id }
 */
router.post(
  '/getByEmployee',
  checkPermission(permission),
  employeeAdvanceController.getEmployeeAdvances
);

/**
 * 3. Get advance details with repayment history
 * POST: /employee-advances/getDetails
 * Body: { advance_id }
 */
router.post(
  '/getDetails',
  checkPermission(permission),
  employeeAdvanceController.getAdvanceDetails
);

/**
 * 4. Add repayment for an advance
 * POST: /employee-advances/addRepayment
 * Body: { advance_id, amount, date, notes }
 */
router.post(
  '/addRepayment',
  checkPermission(permission),
  employeeAdvanceController.addRepayment
);

/**
 * 5. Get repayment history for an advance
 * POST: /employee-advances/getRepayments
 * Body: { advance_id }
 */
router.post(
  '/getRepayments',
  checkPermission(permission),
  employeeAdvanceController.getRepaymentHistory
);

/**
 * 6. Get advance summary for an employee
 * POST: /employee-advances/summary
 * Body: { employee_id }
 */
router.post(
  '/summary',
  checkPermission(permission),
  employeeAdvanceController.getAdvanceSummary
);

module.exports = router;
