const router = require('express').Router();
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { CartType } = require('../models');



/**
 * @typedef {object} CartTypePaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<CartType>} data
 */

/**
 * GET /api/cart-types
 * @summary Get CartTypes list
 * @tags CartTypes
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {CartTypePaginated} 200 - CartTypes paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  CartType.findAndCountAll({
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
 * @typedef {object} CartTypeCreationData
 * @property {string} name
 */

/**
 * POST /api/cart-types
 * @summary Create new CartType
 * @tags CartTypes
 * @param {CartTypeCreationData} request.body.required - CartType data
 * @return {CartType} 200 - Created CartType
 */
router.post('/', (req, res, next) => {
  CartType.create(pick(req.body, [
    'name',
  ]))
    .then((cartType) => res.json(cartType))
    .catch(next);
});


/**
 * GET /api/cart-types/{id}
 * @summary Get single CartType
 * @tags CartTypes
 * @param {string} id.path.required
 * @return {CartType} 200 - CartType
 */
router.get('/:id', (req, res, next) =>
  CartType.findByPk(req.params.id)
    .then((cartType) => res.json(cartType))
    .catch(next)
);

/**
 * PATCH /api/cart-types/{id}
 * @summary Update single CartType
 * @tags CartTypes
 * @param {string} id.path.required
 * @param {CartTypeCreationData} request.body.required
 * @return {CartType} 200 - Updated CartType
 */
router.patch('/:id', (req, res, next) =>
  CartType.update(
    pick(req.body, [
      'name',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [cartType]]) => res.json(cartType))
    .catch(next)
);

/**
 * DELETE /api/cart-types/{id}
 * @summary Delete single CartType
 * @tags CartTypes
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  CartType.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
