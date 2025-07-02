const router = require('express').Router();
const controller      = require('../controllers/productsController');
const validateProduct = require('../middleware/validateProduct');

/* CRUD */
router.get('/', controller.getAllProducts);
router.get('/search', controller.searchProducts);
router.get('/stats', controller.getProductStats);
router.get('/:id', controller.getProductById);
router.post('/', validateProduct, controller.createProduct);
router.put('/:id', validateProduct, controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;
