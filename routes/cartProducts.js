const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { Op } = require('sequelize');
const { DEFAULT_PER_PAGE_COUNT, JWT_BEARER } = require('../config/constants');
const { CartProduct, Product, Cart } = require('../models');
const { sequelize } = require('../config/db');

router.all('*', passport.authenticate(JWT_BEARER));

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
 * @property {number} retailPrice
 * @property {number} costPrice
 * @property {number} discount
 */

/**
 * POST /api/cart-products
 * @summary Create new CartProduct
 * @tags CartProducts
 * @security JWT
 * @param {CartProductCreationData} request.body.required - CartProduct data
 * @return {Cart} 200 - Created CartProduct
 */
router.post('/', async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(req.body.productId);
    if (product === null || product === undefined) {
      throw new Error('product not found.');
    }

    if (product.qty == 0) throw new Error('product out of stock.');

    if (product.qty - req.body.qty < 0) {
      throw new Error(
        `product in stock ${product.qty} less than ${req.body.qty}`
      );
    }

    let cart = await Cart.findByPk(req.body.cartId);
    if (cart === null || cart === undefined) {
      throw new Error('cart not found.');
    }

    const productCart = await CartProduct.findOne({
      where: {
        [Op.and]: [
          { cartId: req.body.cartId },
          { productId: req.body.productId },
        ],
      },
    });
    let pickUpData = {};
    if (productCart !== null && productCart !== undefined) {
      productCart.qty += req.body.qty;
      productCart.retailPrice = req.body.retailPrice;
      productCart.costPrice = req.body.costPrice;
      productCart.discount = req.body.discount;
      pickUpData = product;
    } else {
      pickUpData = req.body;
    }
    const productCartUpdate = await CartProduct.create(
      pick(pickUpData, [
        'cartId',
        'productId',
        'qty',
        'retailPrice',
        'costPrice',
        'discount',
      ]),
      transaction
    );

    if (productCartUpdate === null || productCartUpdate === undefined) {
      throw new Error('can not add product to cart.');
    }

    await transaction.commit();

    cart = await Cart.findByPk(req.body.cartId, {
      include: [
        {
          model: CartProduct,
          as: 'cartItems',
          include: { model: Product, as: 'product' },
        },
      ],
    });
    return res.json(cart);
  } catch (err) {
    await transaction.rollback();
    throw new Error(err);
  }
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
      'retailPrice',
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
