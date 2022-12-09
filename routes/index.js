const router = require('express').Router();
const unhandledRejectionHandler = require('../helpers/unhandledRejectionHandler');
const auth = require('./auth');
const users = require('./users');
const carts = require('./carts');
const categories = require('./categories');
const blackLists = require('./blackLists');
const productLogs = require('./productLogs');
const cartProducts = require('./cartProducts');
const customers = require('./customers');
const dealers = require('./dealers');
const images = require('./images');
const products = require('./products');
const units = require('./units');
const zones = require('./zones');
// const admin = require('./admin');

router.all('*', unhandledRejectionHandler);
router.use('/', auth);
router.use('/users', users);
router.use('/carts', carts);
router.use('/categories', categories);
router.use('/black-lists', blackLists);
router.use('/product-logs', productLogs);
router.use('/cart-products', cartProducts);
router.use('/customers', customers);
router.use('/dealers', dealers);
router.use('/images', images);
router.use('/products', products);
router.use('/units', units);
router.use('/zones', zones);
// router.use('/admin', admin);

module.exports = router;
