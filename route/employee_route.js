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
const permission = 'employees';

// --- 1. EMPLOYEE MANAGEMENT (CRUD) ---

// Helper middleware to conditionally use multer only for multipart/form-data
const conditionalMulter = (req, res, next) => {
    // Only use multer if Content-Type is multipart/form-data
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        return employeeUploadFields(req, res, (err) => {
            // Handle multer errors gracefully
            if (err) {
                console.error('Multer error:', err);
                return res.status(400).json({
                    success: false,
                    message: 'File upload error',
                    error: err.message
                });
            }
            next();
        });
    }
    // Otherwise, skip multer and proceed
    next();
};

// Create Employee: Handle both with and without trailing slash
router.post(
    '/',
    checkPermission(permission),
    conditionalMulter,
    employeeController.createEmployee
);
// Get all employees
router.post('/getAll', checkPermission(permission), employeeController.getAllEmployees);

// Get employee by ID
router.post('/getById', checkPermission(permission), employeeController.getEmployeeById);

// Update employee
router.post('/update', checkPermission(permission), conditionalMulter, employeeController.updateEmployee);

// Delete employee
router.post('/delete', checkPermission(permission), employeeController.deleteEmployee);

module.exports = router;