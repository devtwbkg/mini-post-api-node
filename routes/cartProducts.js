const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { CartProduct } = require('../models');

router.all('*', passport.authenticate('jwt'));


/**
 * @typedef {object} CartProductPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<CartProduct>} data
 */

/**
 * GET /api/cart-products
 * @summary Get CartProducts list
 * @tags CartProducts
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {CartProductPaginated} 200 - CartProducts paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  CartProduct.findAndCountAll({
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
 * @typedef {object} CartProductCreationData
 * @property {string} cartId
 * @property {string} productId
 * @property {integer} qty
 * @property {number} salePrice
 * @property {number} costPrice
 * @property {number} discount
 */

/**
 * POST /api/cart-products
 * @summary Create new CartProduct
 * @tags CartProducts
 * @security JWT
 * @param {CartProductCreationData} request.body.required - CartProduct data
 * @return {CartProduct} 200 - Created CartProduct
 */
router.post('/', (req, res, next) => {
  CartProduct.create(pick(req.body, [
    'cartId',
    'productId',
    'qty',
    'salePrice',
    'costPrice',
    'discount',
  ]))
    .then((cartProduct) => res.json(cartProduct))
    .catch(next);
});


/**
 * GET /api/cart-products/{id}
 * @summary Get single CartProduct
 * @tags CartProducts
 * @security JWT
 * @param {string} id.path.required
 * @return {CartProduct} 200 - CartProduct
 */
router.get('/:id', (req, res, next) =>
  CartProduct.findByPk(req.params.id)
    .then((cartProduct) => res.json(cartProduct))
    .catch(next)
);

/**
 * PATCH /api/cart-products/{id}
 * @summary Update single CartProduct
 * @tags CartProducts
 * @security JWT
 * @param {string} id.path.required
 * @param {CartProductCreationData} request.body.required
 * @return {CartProduct} 200 - Updated CartProduct
 */
router.patch('/:id', (req, res, next) =>
  CartProduct.update(
    pick(req.body, [
      'cartId',
      'productId',
      'qty',
      'salePrice',
      'costPrice',
      'discount',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [cartProduct]]) => res.json(cartProduct))
    .catch(next)
);

/**
 * DELETE /api/cart-products/{id}
 * @summary Delete single CartProduct
 * @tags CartProducts
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  CartProduct.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
