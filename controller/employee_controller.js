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
            const employeeData = { ...req.body, };
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
            // Store array of file paths as JSON string
            employeeData.document_photos = JSON.stringify(documentFiles.map(f => f.path));
        } else {
            // If no files uploaded, set to NULL or empty array
            employeeData.document_photos = null; // or JSON.stringify([])
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

            // Check if there are any fields to update
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: 'No fields provided to update. Please provide at least one field to update.' });
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

    getAllWorkRecords: async (req, res) => { // <-- NEW CONTROLLER METHOD
        try {
            const workRecords = await EmployeeModel.getAllWorkRecords();
            res.status(200).json({ success: true, data: workRecords });
        } catch (error) {
            console.error('Error in getAllWorkRecords:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // --- CONSOLIDATED PAYROLL API ---

    dailyTransaction: async (req, res) => {
        try {
            const { employee_id, work_date, days, overtime_hours = 0, advance_amount = 0, advance_date = work_date } = req.body;
            const createdBy = req.user.id;
            let transactionSummary = {};

            // Validation: days is required, overtime_hours can be negative (early leave) or positive (overtime)
            if (!employee_id || !work_date || days === undefined) {
                return res.status(400).json({ success: false, message: 'employee_id, work_date, and days are required.' });
            }

            // Convert days to hours: 1 day = 10 hours
            // Calculate total working hours: (days * 10) + overtime_hours
            // overtime_hours can be negative (e.g., -1 means 1 hour early = 9 hours total)
            const daysAsFloat = parseFloat(days);
            const overtimeAsFloat = parseFloat(overtime_hours);
            const totalWorkingHours = (daysAsFloat * 10) + overtimeAsFloat;

            // Validate that total hours is not negative
            if (totalWorkingHours < 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Invalid hours calculation: ${days} day(s) + ${overtime_hours} overtime = ${totalWorkingHours} hours. Total hours cannot be negative.` 
                });
            }

            // --- 1. PROCESS DAILY RECORD ---
            const dailySalary = await EmployeeModel.getEmployeeDailySalary(employee_id);
            if (dailySalary === null) {
                return res.status(404).json({ success: false, message: 'Employee not found.' });
            }

            // Calculate daily salary based on total working hours
            // For calculation: working_hours = days * 10, overtime_hours = the modifier
            const daily_salary_paid = calculateDailyPay(dailySalary, daysAsFloat * 10, overtimeAsFloat);

            const workRecordData = {
                employee_id,
                work_date,
                working_hours: totalWorkingHours, // Store total calculated hours
                overtime_hours: overtimeAsFloat, // Store overtime modifier (can be negative)
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
                description: `Processed daily work (${days} day(s), ${overtime_hours} overtime hours = ${totalWorkingHours} total hours) and potential advance for employee ${employee_id} on ${work_date}`
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

    batchDailyTransaction: async (req, res) => {
        try {
            const { transactions } = req.body; // Array of daily transactions

            if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'transactions array is required and must contain at least one transaction.' 
                });
            }

            const results = [];
            const errors = [];
            let successCount = 0;
            let failCount = 0;

            // Process each transaction
            for (let i = 0; i < transactions.length; i++) {
                const transaction = transactions[i];
                const { employee_id, work_date, days, overtime_hours = 0, advance_amount = 0, advance_date = work_date } = transaction;

                try {
                    // Validate required fields
                    if (!employee_id || !work_date || days === undefined) {
                        errors.push({
                            index: i,
                            transaction: transaction,
                            error: 'employee_id, work_date, and days are required.'
                        });
                        failCount++;
                        continue;
                    }

                    // Convert days to hours: 1 day = 10 hours
                    const daysAsFloat = parseFloat(days);
                    const overtimeAsFloat = parseFloat(overtime_hours);
                    const totalWorkingHours = (daysAsFloat * 10) + overtimeAsFloat;

                    // Validate that total hours is not negative
                    if (totalWorkingHours < 0) {
                        errors.push({
                            index: i,
                            transaction: transaction,
                            error: `Invalid hours calculation: ${days} day(s) + ${overtime_hours} overtime = ${totalWorkingHours} hours. Total hours cannot be negative.`
                        });
                        failCount++;
                        continue;
                    }

                    // Get employee daily salary
                    const dailySalary = await EmployeeModel.getEmployeeDailySalary(employee_id);
                    if (dailySalary === null) {
                        errors.push({
                            index: i,
                            transaction: transaction,
                            error: 'Employee not found.'
                        });
                        failCount++;
                        continue;
                    }

                    // Calculate daily salary paid
                    const daily_salary_paid = calculateDailyPay(dailySalary, daysAsFloat * 10, overtimeAsFloat);

                    const workRecordData = {
                        employee_id,
                        work_date,
                        working_hours: totalWorkingHours,
                        overtime_hours: overtimeAsFloat,
                        daily_salary_paid,
                    };

                    // Create work record
                    const newWorkRecord = await EmployeeModel.createWorkRecord(workRecordData);

                    // Process advance if applicable
                    let advanceRecord = null;
                    if (parseFloat(advance_amount) > 0) {
                        const advanceData = {
                            employee_id,
                            advance_date: advance_date,
                            amount: parseFloat(advance_amount),
                            deducted: 0
                        };
                        advanceRecord = await EmployeeModel.createAdvance(advanceData);
                    }

                    results.push({
                        index: i,
                        work_date: work_date,
                        employee_id: employee_id,
                        work_record_id: newWorkRecord.id,
                        daily_pay: daily_salary_paid,
                        advance_id: advanceRecord ? advanceRecord.id : null,
                        status: 'Success'
                    });
                    successCount++;

                } catch (error) {
                    // Handle duplicate entry
                    if (error.code === 'ER_DUP_ENTRY') {
                        errors.push({
                            index: i,
                            transaction: transaction,
                            error: `A work record already exists for employee ${employee_id} on ${work_date}.`
                        });
                    } else {
                        errors.push({
                            index: i,
                            transaction: transaction,
                            error: error.message || 'Unknown error occurred.'
                        });
                    }
                    failCount++;
                }
            }

            // Log activity for batch operation
            await logUserActivity(req, {
                model_name: 'daily_transaction',
                action_type: 'BATCH_CREATE',
                record_id: null,
                description: `Batch processed ${transactions.length} daily transactions: ${successCount} succeeded, ${failCount} failed.`
            });

            // Return results
            const response = {
                success: failCount === 0, // Only true if all succeeded
                message: `Processed ${transactions.length} transactions: ${successCount} succeeded, ${failCount} failed.`,
                summary: {
                    total: transactions.length,
                    succeeded: successCount,
                    failed: failCount
                },
                results: results,
                errors: errors.length > 0 ? errors : undefined
            };

            // Return appropriate status code
            const statusCode = failCount === 0 ? 201 : (successCount > 0 ? 207 : 400); // 207 = Multi-Status
            res.status(statusCode).json(response);

        } catch (error) {
            console.error('Error in batchDailyTransaction:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    getWeeklySalary: async (req, res) => {
        const { employee_id, startDate, endDate } = req.body;

        if (!employee_id || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'employee_id, startDate, and endDate are required.' });
        }

        try {
            // Get employee details to access daily_salary
            const employee = await EmployeeModel.getEmployeeById(employee_id);
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee not found.' });
            }

            const dailySalary = parseFloat(employee.daily_salary) || 0;
            const hourlyRate = dailySalary / 10; // Calculate hourly rate

            // 1. Get daily work records for the date range
            const dailyRecords = await EmployeeModel.getDailyWorkRecords(employee_id, startDate, endDate);

            // 2. Process daily records and create day-by-day breakdown
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dailyBreakdown = [];
            let totalDays = 0;
            let totalHours = 0;
            let totalAmount = 0;

            // Create a map of existing records by date
            const recordsByDate = {};
            dailyRecords.forEach(record => {
                // Handle both Date objects and string dates
                const dateStr = record.work_date instanceof Date 
                    ? record.work_date.toISOString().split('T')[0]
                    : record.work_date.split('T')[0];
                recordsByDate[dateStr] = record;
            });

            // Generate all days in the range (including days with no records)
            const start = new Date(startDate);
            const end = new Date(endDate);
            const allDays = [];

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const dayOfWeek = d.getDay();
                const dayName = dayNames[dayOfWeek];
                
                if (recordsByDate[dateStr]) {
                    // Record exists for this day
                    const record = recordsByDate[dateStr];
                    const workingHours = parseFloat(record.working_hours) || 0;
                    const overtimeHours = parseFloat(record.overtime_hours) || 0;
                    const amount = parseFloat(record.daily_salary_paid) || 0;
                    
                    // Calculate days worked (1 day = 10 hours, 0.5 day = 5 hours, etc.)
                    const daysWorked = workingHours / 10;
                    
                    totalDays += daysWorked;
                    totalHours += workingHours;
                    totalAmount += amount;

                    dailyBreakdown.push({
                        day_name: dayName,
                        date: dateStr,
                        hours: parseFloat(workingHours.toFixed(2)),
                        overtime_hours: parseFloat(overtimeHours.toFixed(2)),
                        days: parseFloat(daysWorked.toFixed(2)),
                        amount: parseFloat(amount.toFixed(2))
                    });
                } else {
                    // No record for this day
                    dailyBreakdown.push({
                        day_name: dayName,
                        date: dateStr,
                        hours: 0,
                        overtime_hours: 0,
                        days: 0,
                        amount: 0
                    });
                }
            }

            // 3. Calculate Gross Weekly Earning (sum of all daily amounts)
            const grossSalary = totalAmount;

            // 4. Get Total Undeducted Advances
            const advancesToDeduct = await EmployeeModel.getTotalUndeductedAdvances(employee_id);

            // 5. Calculate Net Payout
            let netPayout = grossSalary - advancesToDeduct;
            netPayout = parseFloat(netPayout.toFixed(2));

            // 6. Mark advances as deducted (Crucial final step)
            let advancesMarked = 0;
            if (advancesToDeduct > 0 && netPayout >= 0) {
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
                    employee_name: employee.name || null,
                    daily_salary: dailySalary,
                    hourly_rate: parseFloat(hourlyRate.toFixed(2)),
                    week_start: startDate,
                    week_end: endDate,
                    daily_breakdown: dailyBreakdown,
                    totals: {
                        total_days: parseFloat(totalDays.toFixed(2)),
                        total_hours: parseFloat(totalHours.toFixed(2)),
                        total_amount: parseFloat(totalAmount.toFixed(2))
                    },
                    gross_salary: parseFloat(grossSalary.toFixed(2)),
                    advances_deducted: parseFloat(advancesToDeduct.toFixed(2)),
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

    getSalaryTable: async (req, res) => {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'startDate and endDate are required.' });
        }

        try {
            // Normalize startDate to Saturday (regardless of what day frontend sends)
            const startDateObj = new Date(startDate);
            const dayOfWeek = startDateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            // Calculate days to subtract to get to Saturday
            // Saturday (6): 0 days
            // Sunday (0): -1 day (go back 1)
            // Monday (1): -2 days (go back 2)
            // Tuesday (2): -3 days (go back 3)
            // Wednesday (3): -4 days (go back 4)
            // Thursday (4): -5 days (go back 5)
            // Friday (5): -6 days (go back 6)
            const daysToSaturday = dayOfWeek === 6 ? 0 : -(dayOfWeek + 1);
            const normalizedSaturday = new Date(startDateObj);
            normalizedSaturday.setDate(startDateObj.getDate() + daysToSaturday);
            normalizedSaturday.setHours(0, 0, 0, 0); // Ensure time is midnight
            const normalizedWeekStart = normalizedSaturday.toISOString().split('T')[0];
            
            // Calculate normalized week end (Friday = Saturday + 6 days)
            const normalizedFriday = new Date(normalizedSaturday);
            normalizedFriday.setDate(normalizedFriday.getDate() + 6); // Add 6 days to get Friday
            normalizedFriday.setHours(0, 0, 0, 0); // Ensure time is midnight
            const normalizedWeekEnd = normalizedFriday.toISOString().split('T')[0];

            // Get all employees
            const employees = await EmployeeModel.getAllEmployees();
            
            // Day names array ordered by day of week (0=Sun, 1=Mon, ..., 6=Sat)
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // Day order for week starting Saturday: [Sat, Sun, Mon, Tue, Wed, Thu, Fri]
            const weekDayOrder = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
            const salaryTable = [];

            // Process each employee
            for (const employee of employees) {
                const employee_id = employee.id;
                const dailySalary = parseFloat(employee.daily_salary) || 0;
                const hourlyRate = dailySalary / 10;

                // Get daily work records for this employee (use normalized dates)
                const dailyRecords = await EmployeeModel.getDailyWorkRecords(employee_id, normalizedWeekStart, normalizedWeekEnd);

                // Create a map of existing records by date
                const recordsByDate = {};
                dailyRecords.forEach(record => {
                    // Handle both Date objects and string dates
                    const dateStr = record.work_date instanceof Date 
                        ? record.work_date.toISOString().split('T')[0]
                        : record.work_date.split('T')[0];
                    recordsByDate[dateStr] = record;
                });

                // Generate all days in the week (Saturday to Friday)
                const dailyData = {};
                let totalDays = 0;
                let totalHours = 0;
                let totalAmount = 0;

                // Generate Saturday through Friday
                for (let offset = 0; offset <= 6; offset++) {
                    const d = new Date(normalizedSaturday);
                    d.setDate(d.getDate() + offset); // Add offset days to the date
                    d.setHours(0, 0, 0, 0); // Ensure time is midnight
                    const dateStr = d.toISOString().split('T')[0];
                    const dayOfWeek = d.getDay();
                    const dayName = dayNames[dayOfWeek];
                    const dayKey = weekDayOrder[offset]; // Get the day key (sat, sun, mon, etc.)
                    
                    if (recordsByDate[dateStr]) {
                        const record = recordsByDate[dateStr];
                        const workingHours = parseFloat(record.working_hours) || 0;
                        const overtimeHours = parseFloat(record.overtime_hours) || 0;
                        const amount = parseFloat(record.daily_salary_paid) || 0;
                        const daysWorked = workingHours / 10;
                        
                        totalDays += daysWorked;
                        totalHours += workingHours;
                        totalAmount += amount;

                        // Format for frontend: "days/hours" (e.g., "1/3" means 1 day, 3 hours overtime)
                        const daysValue = daysWorked.toFixed(1);
                        const hoursValue = Math.abs(overtimeHours).toFixed(0);
                        const displayValue = `${daysValue}/${hoursValue}`;

                        dailyData[dayKey] = {
                            date: dateStr,
                            value: displayValue, // Frontend format: "days/hours"
                            hours: parseFloat(workingHours.toFixed(2)),
                            overtime_hours: parseFloat(overtimeHours.toFixed(2)),
                            days: parseFloat(daysWorked.toFixed(2)),
                            amount: parseFloat(amount.toFixed(2))
                        };
                    } else {
                        dailyData[dayKey] = {
                            date: dateStr,
                            value: "0/0", // Frontend format
                            hours: 0,
                            overtime_hours: 0,
                            days: 0,
                            amount: 0
                        };
                    }
                }

                salaryTable.push({
                    employee_id: employee_id,
                    employee_name: employee.name || 'Unknown',
                    daily_salary: dailySalary,
                    hourly_rate: parseFloat(hourlyRate.toFixed(2)),
                    sat: dailyData.sat || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                    sun: dailyData.sun || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                    mon: dailyData.mon || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                    tue: dailyData.tue || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                    wed: dailyData.wed || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                    thu: dailyData.thu || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                    fri: dailyData.fri || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                    total_days: parseFloat(totalDays.toFixed(2)),
                    total_hours: parseFloat(totalHours.toFixed(2)),
                    total_amount: parseFloat(totalAmount.toFixed(2))
                });
            }

            await logUserActivity(req, {
                model_name: 'salary_table',
                action_type: 'REPORT',
                record_id: null,
                description: `Generated salary table for period ${startDate} to ${endDate}`
            });

            res.status(200).json({
                success: true,
                data: {
                    week_start: normalizedWeekStart, // Return normalized Saturday
                    week_end: normalizedWeekEnd,     // Return normalized Friday
                    employees: salaryTable
                }
            });

        } catch (error) {
            console.error('Error in getSalaryTable:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Save weekly salary data (batch save for a week)
    saveWeeklySalary: async (req, res) => {
        try {
            const { week_start, week_end, employees_data } = req.body;

            if (!week_start || !week_end || !employees_data || !Array.isArray(employees_data)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'week_start, week_end, and employees_data array are required.' 
                });
            }

            const results = [];
            const errors = [];
            let successCount = 0;
            let failCount = 0;

            // Normalize week_start to Saturday (regardless of what day frontend sends)
            const weekStartDate = new Date(week_start);
            const dayOfWeek = weekStartDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            // Calculate days to subtract to get to Saturday
            // Saturday (6): 0 days
            // Sunday (0): -1 day (go back 1)
            // Monday (1): -2 days (go back 2)
            // Tuesday (2): -3 days (go back 3)
            // Wednesday (3): -4 days (go back 4)
            // Thursday (4): -5 days (go back 5)
            // Friday (5): -6 days (go back 6)
            const daysToSaturday = dayOfWeek === 6 ? 0 : -(dayOfWeek + 1);
            const normalizedSaturday = new Date(weekStartDate);
            normalizedSaturday.setDate(weekStartDate.getDate() + daysToSaturday);
            normalizedSaturday.setHours(0, 0, 0, 0); // Ensure time is midnight
            const normalizedWeekStart = normalizedSaturday.toISOString().split('T')[0];

            // Day name to offset mapping (week_start is now normalized to Saturday)
            // Saturday = 0, Sunday = 1, Monday = 2, Tuesday = 3, Wednesday = 4, Thursday = 5, Friday = 6
            const dayNameToOffset = { 
                'sat': 0, 
                'sun': 1, 
                'mon': 2, 
                'tue': 3, 
                'wed': 4, 
                'thu': 5, 
                'fri': 6 
            };

            // Process each employee's data
            for (const empData of employees_data) {
                const { employee_id, days } = empData; // days: { mon: "1/3", tue: "0.5/-1", ... }

                if (!employee_id || !days) {
                    errors.push({
                        employee_id: employee_id || 'unknown',
                        error: 'employee_id and days object are required.'
                    });
                    failCount++;
                    continue;
                }

                // Verify employee exists
                const employee = await EmployeeModel.getEmployeeById(employee_id);
                if (!employee) {
                    errors.push({
                        employee_id: employee_id,
                        error: 'Employee not found.'
                    });
                    failCount++;
                    continue;
                }

                const dailySalary = parseFloat(employee.daily_salary) || 0;
                const employeeRecords = [];

                // Process each day (mon, tue, wed, etc.)
                for (const [dayName, value] of Object.entries(days)) {
                    if (!value || value === "0/0" || value === "") continue; // Skip empty days

                    // Parse "days/hours" format (e.g., "1/3" or "0.5/-1")
                    const parts = value.split('/');
                    if (parts.length !== 2) {
                        errors.push({
                            employee_id: employee_id,
                            day: dayName,
                            error: `Invalid format for ${dayName}. Expected "days/hours" format.`
                        });
                        continue;
                    }

                    const daysValue = parseFloat(parts[0]) || 0;
                    const overtimeHours = parseFloat(parts[1]) || 0;

                    if (daysValue === 0 && overtimeHours === 0) continue; // Skip if no work

                    // Calculate the date for this day using normalized Saturday
                    const dayOffset = dayNameToOffset[dayName.toLowerCase()];
                    if (dayOffset === undefined) {
                        errors.push({
                            employee_id: employee_id,
                            day: dayName,
                            error: `Invalid day name: ${dayName}. Valid days: sat, sun, mon, tue, wed, thu, fri`
                        });
                        continue;
                    }

                    // Calculate date: normalized Saturday + offset days
                    // Saturday = +0, Sunday = +1, Monday = +2, Tuesday = +3, Wednesday = +4, Thursday = +5, Friday = +6
                    const workDate = new Date(normalizedSaturday);
                    workDate.setDate(normalizedSaturday.getDate() + dayOffset);
                    workDate.setHours(0, 0, 0, 0); // Ensure time is midnight
                    const dateStr = workDate.toISOString().split('T')[0];

                    // Calculate total working hours: (days * 10) + overtime_hours
                    const totalWorkingHours = (daysValue * 10) + overtimeHours;

                    if (totalWorkingHours < 0) {
                        errors.push({
                            employee_id: employee_id,
                            day: dayName,
                            date: dateStr,
                            error: `Invalid hours calculation: ${daysValue} day(s) + ${overtimeHours} overtime = ${totalWorkingHours} hours. Total hours cannot be negative.`
                        });
                        continue;
                    }

                    // Calculate daily salary paid
                    const { calculateDailyPay } = require('../utils/hourlyRateCalculator');
                    const daily_salary_paid = calculateDailyPay(dailySalary, daysValue * 10, overtimeHours);

                    employeeRecords.push({
                        employee_id,
                        work_date: dateStr,
                        days: daysValue,
                        overtime_hours: overtimeHours,
                        working_hours: totalWorkingHours,
                        daily_salary_paid
                    });
                }

                // Save all records for this employee
                if (employeeRecords.length > 0) {
                    try {
                        for (const record of employeeRecords) {
                            const { work_date, days, overtime_hours, working_hours, daily_salary_paid } = record;
                            
                            // Check if record already exists
                            const existingRecords = await EmployeeModel.getDailyWorkRecords(employee_id, work_date, work_date);
                            
                            if (existingRecords.length > 0) {
                                // Update existing record
                                await EmployeeModel.updateWorkRecord(employee_id, work_date, {
                                    working_hours,
                                    overtime_hours,
                                    daily_salary_paid
                                });
                            } else {
                                // Create new record
                                await EmployeeModel.createWorkRecord({
                                    employee_id,
                                    work_date,
                                    working_hours,
                                    overtime_hours,
                                    daily_salary_paid
                                });
                            }
                        }

                        results.push({
                            employee_id,
                            employee_name: employee.name,
                            records_saved: employeeRecords.length,
                            status: 'Success'
                        });
                        successCount++;
                    } catch (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            errors.push({
                                employee_id,
                                error: `Duplicate entry for employee ${employee_id}. Some records may already exist.`
                            });
                        } else {
                            errors.push({
                                employee_id,
                                error: error.message || 'Failed to save records.'
                            });
                        }
                        failCount++;
                    }
                }
            }

            await logUserActivity(req, {
                model_name: 'weekly_salary',
                action_type: 'BATCH_CREATE',
                record_id: null,
                description: `Saved weekly salary data for ${employees_data.length} employees (${successCount} succeeded, ${failCount} failed) for week ${week_start} to ${week_end}`
            });

            // Calculate normalized week end (Friday = Saturday + 6 days)
            const normalizedFriday = new Date(normalizedSaturday);
            normalizedFriday.setDate(normalizedFriday.getDate() + 6); // Add 6 days to get Friday
            normalizedFriday.setHours(0, 0, 0, 0); // Ensure time is midnight
            const normalizedWeekEnd = normalizedFriday.toISOString().split('T')[0];

            // After saving, fetch the updated salary table data to return to frontend
            let salaryTableData = null;
            if (successCount > 0) {
                try {
                    // Get all employees
                    const employees = await EmployeeModel.getAllEmployees();
                    
                    // Day names array ordered by day of week (0=Sun, 1=Mon, ..., 6=Sat)
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    // Day order for week starting Saturday: [Sat, Sun, Mon, Tue, Wed, Thu, Fri]
                    const weekDayOrder = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
                    const salaryTable = [];

                    // Process each employee
                    for (const employee of employees) {
                        const employee_id = employee.id;
                        const dailySalary = parseFloat(employee.daily_salary) || 0;
                        const hourlyRate = dailySalary / 10;

                        // Get daily work records for this employee (use normalized dates)
                        const dailyRecords = await EmployeeModel.getDailyWorkRecords(employee_id, normalizedWeekStart, normalizedWeekEnd);

                        // Create a map of existing records by date
                        const recordsByDate = {};
                        dailyRecords.forEach(record => {
                            // Handle both Date objects and string dates
                            const dateStr = record.work_date instanceof Date 
                                ? record.work_date.toISOString().split('T')[0]
                                : record.work_date.split('T')[0];
                            recordsByDate[dateStr] = record;
                        });

                        // Generate all days in the week (Saturday to Friday)
                        const dailyData = {};
                        let totalDays = 0;
                        let totalHours = 0;
                        let totalAmount = 0;

                        // Generate Saturday through Friday
                        for (let offset = 0; offset <= 6; offset++) {
                            const d = new Date(normalizedSaturday);
                            d.setDate(d.getDate() + offset); // Add offset days to the date
                            d.setHours(0, 0, 0, 0); // Ensure time is midnight
                            const dateStr = d.toISOString().split('T')[0];
                            const dayOfWeek = d.getDay();
                            const dayName = dayNames[dayOfWeek];
                            const dayKey = weekDayOrder[offset]; // Get the day key (sat, sun, mon, etc.)
                            
                            if (recordsByDate[dateStr]) {
                                const record = recordsByDate[dateStr];
                                const workingHours = parseFloat(record.working_hours) || 0;
                                const overtimeHours = parseFloat(record.overtime_hours) || 0;
                                const amount = parseFloat(record.daily_salary_paid) || 0;
                                const daysWorked = workingHours / 10;
                                
                                totalDays += daysWorked;
                                totalHours += workingHours;
                                totalAmount += amount;

                                // Format for frontend: "days/hours" (e.g., "1/3" means 1 day, 3 hours overtime)
                                const daysValue = daysWorked.toFixed(1);
                                const hoursValue = Math.abs(overtimeHours).toFixed(0);
                                const displayValue = `${daysValue}/${hoursValue}`;

                                dailyData[dayKey] = {
                                    date: dateStr,
                                    value: displayValue, // Frontend format: "days/hours"
                                    hours: parseFloat(workingHours.toFixed(2)),
                                    overtime_hours: parseFloat(overtimeHours.toFixed(2)),
                                    days: parseFloat(daysWorked.toFixed(2)),
                                    amount: parseFloat(amount.toFixed(2))
                                };
                            } else {
                                dailyData[dayKey] = {
                                    date: dateStr,
                                    value: "0/0", // Frontend format
                                    hours: 0,
                                    overtime_hours: 0,
                                    days: 0,
                                    amount: 0
                                };
                            }
                        }

                        salaryTable.push({
                            employee_id: employee_id,
                            employee_name: employee.name || 'Unknown',
                            daily_salary: dailySalary,
                            hourly_rate: parseFloat(hourlyRate.toFixed(2)),
                            sat: dailyData.sat || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                            sun: dailyData.sun || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                            mon: dailyData.mon || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                            tue: dailyData.tue || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                            wed: dailyData.wed || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                            thu: dailyData.thu || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                            fri: dailyData.fri || { date: '', value: "0/0", hours: 0, overtime_hours: 0, days: 0, amount: 0 },
                            total_days: parseFloat(totalDays.toFixed(2)),
                            total_hours: parseFloat(totalHours.toFixed(2)),
                            total_amount: parseFloat(totalAmount.toFixed(2))
                        });
                    }

                    salaryTableData = {
                        week_start: normalizedWeekStart,
                        week_end: normalizedWeekEnd,
                        employees: salaryTable
                    };
                } catch (error) {
                    console.error('Error fetching salary table data after save:', error);
                    // Continue without salary table data if fetch fails
                }
            }

            const response = {
                success: failCount === 0,
                message: `Processed ${employees_data.length} employees: ${successCount} succeeded, ${failCount} failed.`,
                summary: {
                    total: employees_data.length,
                    succeeded: successCount,
                    failed: failCount
                },
                week_info: {
                    provided_start: week_start,      // Original date from frontend
                    provided_end: week_end,          // Original date from frontend
                    normalized_start: normalizedWeekStart,  // Normalized to Saturday
                    normalized_end: normalizedWeekEnd      // Normalized to Friday
                },
                results: results,
                errors: errors.length > 0 ? errors : undefined,
                data: salaryTableData  // Return updated salary table data with totals
            };

            const statusCode = failCount === 0 ? 201 : (successCount > 0 ? 207 : 400);
            res.status(statusCode).json(response);

        } catch (error) {
            console.error('Error in saveWeeklySalary:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Get all weeks with salary data
    getAllSalaryWeeks: async (req, res) => {
        try {
            // Get all unique weeks from work records
            const weeks = await EmployeeModel.getAllSalaryWeeks();

            // Get current week start (Saturday)
            const today = new Date();
            const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            // Calculate days to subtract to get to Saturday
            // Saturday (6): 0 days
            // Sunday (0): -1 day (go back 1)
            // Monday (1): -2 days (go back 2)
            // Tuesday (2): -3 days (go back 3)
            // Wednesday (3): -4 days (go back 4)
            // Thursday (4): -5 days (go back 5)
            // Friday (5): -6 days (go back 6)
            const daysToSaturday = day === 6 ? 0 : -(day + 1);
            const currentSaturday = new Date(today);
            currentSaturday.setDate(today.getDate() + daysToSaturday);
            currentSaturday.setHours(0, 0, 0, 0);
            const currentWeekStart = currentSaturday.toISOString().split('T')[0];

            res.status(200).json({
                success: true,
                data: {
                    weeks: weeks,
                    current_week_start: currentWeekStart // Returns Saturday of current week
                }
            });

        } catch (error) {
            console.error('Error in getAllSalaryWeeks:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },
};

module.exports = employeeController;