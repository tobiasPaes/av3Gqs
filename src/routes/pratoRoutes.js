const express = require('express');
const router = express.Router();
const PratoController = require('../controllers/pratoController');

router.post('/', PratoController.create);
router.get('/', PratoController.findAll);
router.get('/:id', PratoController.findById);
router.put('/:id', PratoController.update);
router.delete('/:id', PratoController.delete);

module.exports = router; 