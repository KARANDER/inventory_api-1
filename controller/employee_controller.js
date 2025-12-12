// controller/employee_controller.js

const EmployeeModel = require('../model/employee_model');
const { logUserActivity } = require('../utils/activityLogger');

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
    }
};

module.exports = employeeController;
