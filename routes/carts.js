const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { Op } = require('sequelize');
const {
  DEFAULT_PER_PAGE_COUNT,
  BEARER_KEY,
  INPROGRESS,
} = require('../config/constants');
const { Cart, CartProduct, Product } = require('../models');

router.all('*', passport.authenticate(BEARER_KEY));

/**
 * @typedef {object} CartPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Cart>} data
 */

/**
 * GET /api/carts
 * @summary Get Carts list
 * @tags Carts
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {CartPaginated} 200 - Carts paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Cart.findAndCountAll({
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
 * GET /api/carts/my-cart
 * @summary Get single Cart
 * @tags Carts
 * @security JWT
 * @return {Cart} 200 - Cart
 */
router.get('/my-cart', async (req, res, next) => {
  Cart.findOne({
    where: {
      [Op.and]: [{ customerId: req.user.id }, { cartStatus: INPROGRESS }],
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: CartProduct,
        as: 'cartItems',
        include: { model: Product, as: 'product' },
      },
    ],
  })
    .then((cart) => {
      return res.json(cart);
    })
    .catch(next);
});
/**
 * @typedef {object} CartCreationData
 * @property {string} cartStatus
 * @property {string} errorMessage
 * @property {number} total
 * @property {number} vat
 * @property {number} discount
 * @property {integer} qty
 * @property {string} promoCode
 * @property {number} promoCodeAmount
 * @property {string} promoCodeMessage
 * @property {integer} redeemPoint
 * @property {number} redeemPointAmount
 * @property {string} customerId
 */

/**
 * POST /api/carts
 * @summary Create new Cart
 * @tags Carts
 * @security JWT
 * @param {CartCreationData} request.body.required - Cart data
 * @return {Cart} 200 - Created Cart
 */
router.post('/', (req, res, next) => {
  Cart.create(
    pick(req.body, [
      'cartStatus',
      'errorMessage',
      'total',
      'vat',
      'discount',
      'qty',
      'promoCode',
      'promoCodeAmount',
      'promoCodeMessage',
      'redeemPoint',
      'redeemPointAmount',
      'customerId',
    ])
  )
    .then((cart) => res.json(cart))
    .catch(next);
});

/**
 * GET /api/carts/{id}
 * @summary Get single Cart
 * @tags Carts
 * @security JWT
 * @param {string} id.path.required
 * @return {Cart} 200 - Cart
 */
router.get('/:id', (req, res, next) =>
  Cart.findByPk(req.params.id)
    .then((cart) => res.json(cart))
    .catch(next)
);

/**
 * PATCH /api/carts/{id}
 * @summary Update single Cart
 * @tags Carts
 * @security JWT
 * @param {string} id.path.required
 * @param {CartCreationData} request.body.required
 * @return {Cart} 200 - Updated Cart
 */
router.patch('/:id', (req, res, next) =>
  Cart.update(
    pick(req.body, [
      'cartStatus',
      'errorMessage',
      'total',
      'vat',
      'discount',
      'qty',
      'promoCode',
      'promoCodeAmount',
      'promoCodeMessage',
      'redeemPoint',
      'redeemPointAmount',
      'customerId',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [cart]]) => res.json(cart))
    .catch(next)
);

/**
 * DELETE /api/carts/{id}
 * @summary Delete single Cart
 * @tags Carts
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Cart.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
