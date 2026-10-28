const express = require('express');
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // every address route needs login

router.get('/', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;