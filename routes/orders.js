const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { Order } = require('../models');

router.all('*', passport.authenticate('jwt'));


/**
 * @typedef {object} OrderPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Order>} data
 */

/**
 * GET /api/orders
 * @summary Get Orders list
 * @tags Orders
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {OrderPaginated} 200 - Orders paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Order.findAndCountAll({
    offset: perPageCount * pageIndex,
    limit: perPageCount,
  })
    .then(({ count, rows }) =>
      res.json({
        totalCount: count,
        pageIndex,
        data: rows,
      })
    )
    .catch(next);
});

/**
 * @typedef {object} OrderCreationData
 * @property {string} customerId
 * @property {string} orderStatus
 * @property {string} paymentMethod
 * @property {string} shippingMethod
 * @property {integer} redeemPoint
 * @property {string} usePromoCode
 */

/**
 * POST /api/orders
 * @summary Create new Order
 * @tags Orders
 * @security JWT
 * @param {OrderCreationData} request.body.required - Order data
 * @return {Order} 200 - Created Order
 */
router.post('/', (req, res, next) => {
  Order.create(pick(req.body, [
    'customerId',
    'orderStatus',
    'paymentMethod',
    'shippingMethod',
    'redeemPoint',
    'usePromoCode',
  ]))
    .then((order) => res.json(order))
    .catch(next);
});


/**
 * GET /api/orders/{id}
 * @summary Get single Order
 * @tags Orders
 * @security JWT
 * @param {string} id.path.required
 * @return {Order} 200 - Order
 */
router.get('/:id', (req, res, next) =>
  Order.findByPk(req.params.id)
    .then((order) => res.json(order))
    .catch(next)
);

/**
 * PATCH /api/orders/{id}
 * @summary Update single Order
 * @tags Orders
 * @security JWT
 * @param {string} id.path.required
 * @param {OrderCreationData} request.body.required
 * @return {Order} 200 - Updated Order
 */
router.patch('/:id', (req, res, next) =>
  Order.update(
    pick(req.body, [
      'customerId',
      'orderStatus',
      'paymentMethod',
      'shippingMethod',
      'redeemPoint',
      'usePromoCode',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [order]]) => res.json(order))
    .catch(next)
);

/**
 * DELETE /api/orders/{id}
 * @summary Delete single Order
 * @tags Orders
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Order.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
