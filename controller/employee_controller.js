// controller/employee_controller.js

const EmployeeModel = require('../model/employee_model');
const { calculateDailyPay } = require('../utils/hourlyRateCalculator');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges'); 

const employeeController = {

    // --- EMPLOYEE MANAGEMENT (CRUD) ---

    createEmployee: async (req, res) => {
        try {
            const createdBy = req.user.id;
            const employeeData = { ...req.body,  };
            const profileFile = req.files && req.files['profile_photo'] ? req.files['profile_photo'][0] : null;
            const documentFiles = req.files && req.files['document_photos'] ? req.files['document_photos'] : [];

            // Collect all non-file data from the body
            // let employeeData = { ...req.body, created_by: createdBy };

            // Overwrite photo fields with the stored paths (assuming /uploads/ is the root)
            if (profileFile) {
                // Example path: /uploads/profile_photo-1701100000.jpg
                employeeData.profile_photo = profileFile.path; 
            }
            if (documentFiles.length > 0) {
    // If files were uploaded via Multer, map the file paths and stringify them.
    // Multer gives us clean paths (e.g., 'uploads/doc.pdf').
    employeeData.document_photos = JSON.stringify(documentFiles.map(f => f.path));
} else if (req.body.document_photos) {
    // If no files were uploaded, but a JSON string of paths was passed in the form-data.
    // The incoming value is already a string, e.g., '["/path/to/doc1.pdf"]'.
    // We attempt to parse it and stringify it back to ensure it's clean and valid JSON.
    try {
        // Step 1: Parse the string received from form-data (which might be over-escaped)
        const parsedPaths = JSON.parse(req.body.document_photos);
        
        // Step 2: Stringify the array back. This creates a clean, correctly-escaped JSON string for MySQL.
        employeeData.document_photos = JSON.stringify(parsedPaths);
        
    } catch (e) {
        console.warn("Could not parse document_photos string from body. Passing raw string. Error:", e.message);
        // Fallback: If parsing fails, try to pass the raw string, but this is less safe.
        employeeData.document_photos = req.body.document_photos; 
    }
}

            if (!employeeData.name || !employeeData.mobile || !employeeData.daily_salary) {
                return res.status(400).json({ success: false, message: 'Name, mobile, and daily_salary are required.' });
            }

            const newEmployee = await EmployeeModel.createEmployee(employeeData);

            await logUserActivity(req, {
                model_name: 'employees',
                action_type: 'CREATE',
                record_id: newEmployee.id,
                description: `Created new employee: ${newEmployee.name}`
            });

            res.status(201).json({ success: true, data: newEmployee });
        } catch (error) {
            console.error('Error in createEmployee:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    getAllEmployees: async (req, res) => {
        try {
            const employees = await EmployeeModel.getAllEmployees();
            res.status(200).json({ success: true, data: employees });
        } catch (error) {
            console.error('Error in getAllEmployees:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    updateEmployee: async (req, res) => {
        try {
            const { id, ...updateData } = req.body;
            if (!id) {
                return res.status(400).json({ success: false, message: 'Employee ID is required in the body.' });
            }

            const oldRecord = await EmployeeModel.getEmployeeById(id);
            if (!oldRecord) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }

            const affectedRows = await EmployeeModel.updateEmployee(id, updateData);
            
            const changes = compareChanges(oldRecord, updateData);
            await logUserActivity(req, {
                model_name: 'employees',
                action_type: 'UPDATE',
                record_id: id,
                description: 'Updated employee details',
                changes: changes
            });

            res.status(200).json({ success: true, message: 'Employee updated successfully' });
        } catch (error) {
            console.error('Error in updateEmployee:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    deleteEmployee: async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ success: false, message: 'Employee ID is required in the body.' });
            }

            const affectedRows = await EmployeeModel.deleteEmployee(id);
            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }

            await logUserActivity(req, {
                model_name: 'employees',
                action_type: 'DELETE',
                record_id: id,
                description: 'Deactivated employee'
            });

            res.status(200).json({ success: true, message: 'Employee deleted successfully' });
        } catch (error) {
            console.error('Error in deleteEmployee:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },


    // --- CONSOLIDATED PAYROLL API ---

    dailyTransaction: async (req, res) => {
        try {
            const { employee_id, work_date, working_hours, overtime_hours = 0, advance_amount = 0, advance_date = work_date } = req.body;
            const createdBy = req.user.id;
            let transactionSummary = {};

            if (!employee_id || !work_date || working_hours === undefined) {
                return res.status(400).json({ success: false, message: 'employee_id, work_date, and working_hours are required.' });
            }

            // --- 1. PROCESS DAILY RECORD ---
            const dailySalary = await EmployeeModel.getEmployeeDailySalary(employee_id);
            if (dailySalary === null) {
                return res.status(404).json({ success: false, message: 'Employee not found.' });
            }
            
            const daily_salary_paid = calculateDailyPay(dailySalary, working_hours, overtime_hours);

            const workRecordData = {
                employee_id,
                work_date,
                working_hours: parseFloat(working_hours),
                overtime_hours: parseFloat(overtime_hours),
                daily_salary_paid,
            };

            const newWorkRecord = await EmployeeModel.createWorkRecord(workRecordData);
            
            transactionSummary.daily_record = { 
                id: newWorkRecord.id, 
                daily_pay: daily_salary_paid,
                status: 'Created' 
            };
            
            // --- 2. PROCESS ADVANCE (IF APPLICABLE) ---
            if (parseFloat(advance_amount) > 0) {
                const advanceData = {
                    employee_id,
                    advance_date: advance_date,
                    amount: parseFloat(advance_amount),
                    deducted: 0 // Default to pending deduction
                };

                const newAdvance = await EmployeeModel.createAdvance(advanceData);

                transactionSummary.advance = {
                    id: newAdvance.id,
                    amount: parseFloat(advance_amount),
                    status: 'Created'
                };
            } else {
                 transactionSummary.advance = { status: 'Skipped', message: 'No advance amount provided.' };
            }

            await logUserActivity(req, {
                model_name: 'daily_transaction',
                action_type: 'CREATE',
                record_id: employee_id,
                description: `Processed daily work and potential advance for employee ${employee_id} on ${work_date}`
            });


            res.status(201).json({ 
                success: true, 
                message: 'Daily transaction processed successfully.',
                summary: transactionSummary
            });

        } catch (error) {
            // Handle duplicate entry for daily record
            if (error.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ success: false, message: 'A work record already exists for this employee on this date. Use an update API instead.', error: error.message });
            }
            console.error('Error in dailyTransaction:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    getWeeklySalary: async (req, res) => {
        const { employee_id, startDate, endDate } = req.body;
        
        if (!employee_id || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'employee_id, startDate, and endDate are required.' });
        }

        try {
            // 1. Calculate Gross Weekly Earning
            const grossSalary = await EmployeeModel.getGrossWeeklySalary(employee_id, startDate, endDate);
            
            // 2. Get Total Undeducted Advances
            const advancesToDeduct = await EmployeeModel.getTotalUndeductedAdvances(employee_id);

            // 3. Calculate Net Payout
            let netPayout = grossSalary - advancesToDeduct;
            netPayout = parseFloat(netPayout.toFixed(2)); 

            // 4. Mark advances as deducted (Crucial final step)
            let advancesMarked = 0;
            if (advancesToDeduct > 0 && netPayout >= 0) { // Only mark if there's a positive or zero net payout 
                advancesMarked = await EmployeeModel.markAdvancesAsDeducted(employee_id);
            }
            
            await logUserActivity(req, {
                model_name: 'payroll_report',
                action_type: 'REPORT',
                record_id: employee_id,
                description: `Generated weekly salary for employee ${employee_id} (${startDate} to ${endDate})`
            });

            res.status(200).json({
                success: true,
                data: {
                    employee_id,
                    week_start: startDate,
                    week_end: endDate,
                    gross_salary: grossSalary,
                    advances_deducted: advancesToDeduct,
                    net_payout: netPayout,
                    advances_marked_as_paid: advancesMarked,
                    notes: advancesMarked > 0 ? 'Pending advances have been marked as deducted.' : 'No advances deducted this cycle.'
                }
            });

        } catch (error) {
            console.error('Error in getWeeklySalary:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },
};

module.exports = employeeController;