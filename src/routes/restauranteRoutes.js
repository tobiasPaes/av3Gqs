const express = require('express');
const router = express.Router();
const RestauranteController = require('../controllers/restauranteController');

router.post('/', RestauranteController.create);
router.get('/', RestauranteController.findAll);
router.get('/:id', RestauranteController.findById);
router.put('/:id', RestauranteController.update);
router.delete('/:id', RestauranteController.delete);

module.exports = router; 