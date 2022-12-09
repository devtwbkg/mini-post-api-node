const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { Product, Unit, Category, Images, Zone } = require('../models');

router.all('*', passport.authenticate('jwt'));

/**
 * @typedef {object} ProductPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Product>} data
 */

/**
 * GET /api/products
 * @summary Get Products list
 * @tags Products
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {ProductPaginated} 200 - Products paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Product.findAndCountAll({
    include: [
      { model: Images, as: 'images', through: { attributes: [] } },
      { model: Unit, as: 'unit' },
      { model: Category, as: 'category' },
      { model: Zone, as: 'zone' },
    ],
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
 * @typedef {object} ProductCreationData
 * @property {string} code
 * @property {string} name
 * @property {string} description
 * @property {integer} qty
 * @property {number} costPrice
 * @property {number} salePrice
 * @property {string} imageId
 * @property {string} categoryId
 * @property {string} zoneId
 * @property {string} unitId
 * @property {string} expiredDate
 */

/**
 * POST /api/products
 * @summary Create new Product
 * @tags Products
 * @security JWT
 * @param {ProductCreationData} request.body.required - Product data
 * @return {Product} 200 - Created Product
 */
router.post('/', (req, res, next) => {
  Product.create(
    pick(req.body, [
      'code',
      'name',
      'description',
      'qty',
      'costPrice',
      'salePrice',
      'imageId',
      'categoryId',
      'zoneId',
      'unitId',
      'expiredDate',
    ])
  )
    .then((product) => res.json(product))
    .catch(next);
});

/**
 * GET /api/products/{id}
 * @summary Get single Product
 * @tags Products
 * @security JWT
 * @param {string} id.path.required
 * @return {Product} 200 - Product
 */
router.get('/:id', (req, res, next) =>
  Product.findByPk(req.params.id)
    .then((product) => res.json(product))
    .catch(next)
);

/**
 * PATCH /api/products/{id}
 * @summary Update single Product
 * @tags Products
 * @security JWT
 * @param {string} id.path.required
 * @param {ProductCreationData} request.body.required
 * @return {Product} 200 - Updated Product
 */
router.patch('/:id', (req, res, next) =>
  Product.update(
    pick(req.body, [
      'name',
      'description',
      'qty',
      'costPrice',
      'salePrice',
      'imageId',
      'categoryId',
      'zoneId',
      'unitId',
      'expiredDate',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [product]]) => res.json(product))
    .catch(next)
);

/**
 * DELETE /api/products/{id}
 * @summary Delete single Product
 * @tags Products
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Product.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
