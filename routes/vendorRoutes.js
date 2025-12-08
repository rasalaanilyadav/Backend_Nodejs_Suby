const express = require('express');
const vendorController = require('../controllers/vendorController');

console.log('Loaded vendorController:', typeof vendorController, Object.keys(vendorController || {})); 

const router = express.Router();

router.post('/register', vendorController.vendorRegister);
router.post('/login', vendorController.vendorLogin);
router.get('/all-vendors', vendorController.getAllVendors);
router.get('/single-vendors/:apple', vendorController.getVendorById);

module.exports = router;
