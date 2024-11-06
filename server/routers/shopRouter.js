const express = require('express');
const router = express.Router();
const controller = require('../controllers/shopController');
const authenticate = require('../middlewares/authenticate');


router.get('/getallshops', controller.getShops);
router.post('/create', authenticate, controller.createShop);
router.get('/', authenticate, controller.getShopsByOwnerId);
router.get('/:shopId', controller.getShopDetail);
router.put('/:shopId', authenticate, controller.editShop);
router.delete('/:shopId', authenticate, controller.deleteShop);

module.exports = router;
