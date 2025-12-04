// route/employee_route.js

const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employee_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// --- START NEW/REVISED CODE ---
// Import your existing multer configuration
const upload = require('../middlewares/upload'); // Assuming upload.js is in the 'middlewares' folder
// If upload.js is in 'utils', use: const upload = require('../utils/upload'); 
// Adjust path as needed. Assuming 'middlewares' for now for structure clarity.

// Define the fields Multer should expect for file uploads
const employeeUploadFields = upload.fields([
    { name: 'profile_photo', maxCount: 1 },
    { name: 'document_photos', maxCount: 5 } // Assuming max 5 document photos
]); 
// --- END NEW/REVISED CODE ---

// All routes for this module require authentication
router.use(authMiddleware);

// Define a new permission for employee management
const permission = 'employee_management';


// --- 1. EMPLOYEE MANAGEMENT (CRUD) ---

// Create Employee: Use the configured upload middleware before the controller
router.post(
    '/', 
    checkPermission(permission), 
    employeeUploadFields, // <-- NEW: Handles form-data and files
    employeeController.createEmployee
);
// ... other CRUD routes remain the same ...
router.post('/getAll', checkPermission(permission), employeeController.getAllEmployees);
router.post('/update', checkPermission(permission), employeeController.updateEmployee);
router.post('/delete', checkPermission(permission), employeeController.deleteEmployee);


// --- 2. CONSOLIDATED PAYROLL APIS ---

// Consolidated API for adding daily work record AND optional advance
router.post('/dailyTransaction', checkPermission(permission), employeeController.dailyTransaction);

// Batch API for adding multiple daily work records at once (e.g., weekend records)
router.post('/batchDailyTransaction', checkPermission(permission), employeeController.batchDailyTransaction);

// Get Weekly Salary Summary and finalize payment (Gross - Advance = Net)
router.post('/getWeeklySalary', checkPermission(permission), employeeController.getWeeklySalary);

// Get Salary Table for multiple employees (for UI table display)
router.post('/getSalaryTable', checkPermission(permission), employeeController.getSalaryTable);

router.post('/getAllWorkRecords', checkPermission(permission), employeeController.getAllWorkRecords);


module.exports = router;