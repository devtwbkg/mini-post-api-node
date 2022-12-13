const router = require('express').Router();
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { SaleType } = require('../models');



/**
 * @typedef {object} SaleTypePaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<SaleType>} data
 */

/**
 * GET /api/sale-types
 * @summary Get SaleTypes list
 * @tags SaleTypes
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {SaleTypePaginated} 200 - SaleTypes paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  SaleType.findAndCountAll({
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
 * @typedef {object} SaleTypeCreationData
 * @property {string} name
 */

/**
 * POST /api/sale-types
 * @summary Create new SaleType
 * @tags SaleTypes
 * @param {SaleTypeCreationData} request.body.required - SaleType data
 * @return {SaleType} 200 - Created SaleType
 */
router.post('/', (req, res, next) => {
  SaleType.create(pick(req.body, [
    'name',
  ]))
    .then((saleType) => res.json(saleType))
    .catch(next);
});


/**
 * GET /api/sale-types/{id}
 * @summary Get single SaleType
 * @tags SaleTypes
 * @param {string} id.path.required
 * @return {SaleType} 200 - SaleType
 */
router.get('/:id', (req, res, next) =>
  SaleType.findByPk(req.params.id)
    .then((saleType) => res.json(saleType))
    .catch(next)
);

/**
 * PATCH /api/sale-types/{id}
 * @summary Update single SaleType
 * @tags SaleTypes
 * @param {string} id.path.required
 * @param {SaleTypeCreationData} request.body.required
 * @return {SaleType} 200 - Updated SaleType
 */
router.patch('/:id', (req, res, next) =>
  SaleType.update(
    pick(req.body, [
      'name',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [saleType]]) => res.json(saleType))
    .catch(next)
);

/**
 * DELETE /api/sale-types/{id}
 * @summary Delete single SaleType
 * @tags SaleTypes
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  SaleType.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
