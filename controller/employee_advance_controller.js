// controller/employee_advance_controller.js

const EmployeeModel = require('../model/employee_model');
const { logUserActivity } = require('../utils/activityLogger');

const employeeAdvanceController = {

  /**
   * Create a new advance payment for employee
   * POST: /employees/advances
   */
  createAdvance: async (req, res) => {
    try {
      const { employee_id, amount, reason, date } = req.body;
      const created_by = req.user.id;

      // Validation
      if (!employee_id || !amount || !date) {
        return res.status(400).json({
          success: false,
          message: 'employee_id, amount, and date are required.'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0.'
        });
      }

      // Check if employee exists
      const employee = await EmployeeModel.getEmployeeById(employee_id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.'
        });
      }

      // Create advance
      const advanceData = {
        employee_id,
        amount: parseFloat(amount),
        reason: reason || null,
        date,
        created_by
      };

      const newAdvance = await EmployeeModel.createAdvancePayment(advanceData);

      // Log activity
      await logUserActivity(req, {
        model_name: 'employee_advances',
        action_type: 'CREATE',
        record_id: newAdvance.id,
        description: `Created advance payment of ₹${amount} for employee: ${employee.name}`
      });

      res.status(201).json({
        success: true,
        message: 'Advance payment created successfully',
        data: newAdvance
      });
    } catch (error) {
      console.error('Error in createAdvance:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get all advances for an employee
   * POST: /employees/advances/getByEmployee
   */
  getEmployeeAdvances: async (req, res) => {
    try {
      const { employee_id } = req.body;

      if (!employee_id) {
        return res.status(400).json({
          success: false,
          message: 'employee_id is required.'
        });
      }

      const employee = await EmployeeModel.getEmployeeById(employee_id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.'
        });
      }

      const advances = await EmployeeModel.getEmployeeAdvances(employee_id);
      const summary = await EmployeeModel.getEmployeeAdvanceSummary(employee_id);

      res.status(200).json({
        success: true,
        data: {
          employee_name: employee.name,
          employee_id,
          summary,
          advances
        }
      });
    } catch (error) {
      console.error('Error in getEmployeeAdvances:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get advance details with repayment history
   * POST: /employees/advances/getDetails
   */
  getAdvanceDetails: async (req, res) => {
    try {
      const { advance_id } = req.body;

      if (!advance_id) {
        return res.status(400).json({
          success: false,
          message: 'advance_id is required.'
        });
      }

      const advanceDetails = await EmployeeModel.getAdvanceDetails(advance_id);

      if (!advanceDetails) {
        return res.status(404).json({
          success: false,
          message: 'Advance not found.'
        });
      }

      res.status(200).json({
        success: true,
        data: advanceDetails
      });
    } catch (error) {
      console.error('Error in getAdvanceDetails:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Add repayment for an advance
   * POST: /employees/advances/addRepayment
   */
  addRepayment: async (req, res) => {
    try {
      const { advance_id, amount, date, notes } = req.body;
      const created_by = req.user.id;

      // Validation
      if (!advance_id || !amount || !date) {
        return res.status(400).json({
          success: false,
          message: 'advance_id, amount, and date are required.'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Repayment amount must be greater than 0.'
        });
      }

      // Get advance details to check remaining balance
      const advance = await EmployeeModel.getAdvanceDetails(advance_id);

      if (!advance) {
        return res.status(404).json({
          success: false,
          message: 'Advance not found.'
        });
      }

      if (advance.remaining_balance <= 0) {
        return res.status(400).json({
          success: false,
          message: 'This advance has already been fully repaid.'
        });
      }

      if (amount > advance.remaining_balance) {
        return res.status(400).json({
          success: false,
          message: `Repayment amount cannot exceed remaining balance of ₹${advance.remaining_balance}`,
          remaining_balance: advance.remaining_balance
        });
      }

      // Add repayment
      const repaymentData = {
        advance_id,
        employee_id: advance.employee_id,
        amount: parseFloat(amount),
        date,
        notes: notes || null,
        created_by
      };

      const newRepayment = await EmployeeModel.addAdvanceRepayment(repaymentData);

      // Log activity
      await logUserActivity(req, {
        model_name: 'employee_advance_repayments',
        action_type: 'CREATE',
        record_id: newRepayment.id,
        description: `Added repayment of ₹${amount} for advance ID: ${advance_id} - Employee: ${advance.employee_name}`
      });

      // Get updated advance details
      const updatedAdvance = await EmployeeModel.getAdvanceDetails(advance_id);

      res.status(201).json({
        success: true,
        message: 'Repayment added successfully',
        data: {
          repayment: newRepayment,
          updated_advance: updatedAdvance
        }
      });
    } catch (error) {
      console.error('Error in addRepayment:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get repayment history for an advance
   * POST: /employees/advances/getRepayments
   */
  getRepaymentHistory: async (req, res) => {
    try {
      const { advance_id } = req.body;

      if (!advance_id) {
        return res.status(400).json({
          success: false,
          message: 'advance_id is required.'
        });
      }

      const advance = await EmployeeModel.getAdvanceDetails(advance_id);

      if (!advance) {
        return res.status(404).json({
          success: false,
          message: 'Advance not found.'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          advance_id,
          employee_name: advance.employee_name,
          original_amount: advance.amount,
          remaining_balance: advance.remaining_balance,
          status: advance.status,
          advance_date: advance.date,
          repayment_history: advance.repayments
        }
      });
    } catch (error) {
      console.error('Error in getRepaymentHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get advance summary for an employee
   * POST: /employees/advances/summary
   */
  getAdvanceSummary: async (req, res) => {
    try {
      const { employee_id } = req.body;

      if (!employee_id) {
        return res.status(400).json({
          success: false,
          message: 'employee_id is required.'
        });
      }

      const employee = await EmployeeModel.getEmployeeById(employee_id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.'
        });
      }

      const summary = await EmployeeModel.getEmployeeAdvanceSummary(employee_id);

      res.status(200).json({
        success: true,
        data: {
          employee_id,
          employee_name: employee.name,
          ...summary
        }
      });
    } catch (error) {
      console.error('Error in getAdvanceSummary:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
};

module.exports = employeeAdvanceController;
