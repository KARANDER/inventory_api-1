const express = require('express');
const router = express.Router();
const cartonInventoryController = require('../controller/carton_inventory_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// Apply authentication middleware to all routes in this file
router.use(authMiddleware);

// Define a permission string for this module
const permission = 'master_items'; // You might need to add this permission to your database

// Route to add a new carton
router.post('/addCarton', checkPermission(permission), cartonInventoryController.addCarton);
router.post('/getCartonNames', checkPermission(permission), cartonInventoryController.getCartonNames);
router.post('/updateCarton', checkPermission(permission), cartonInventoryController.updateCarton);
router.post('/deleteCarton', checkPermission(permission), cartonInventoryController.deleteCarton);

module.exports = router;