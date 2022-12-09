const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { ProductLog } = require('../models');

router.all('*', passport.authenticate('jwt'));


/**
 * @typedef {object} ProductLogPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<ProductLog>} data
 */

/**
 * GET /api/product-logs
 * @summary Get ProductLogs list
 * @tags ProductLogs
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {ProductLogPaginated} 200 - ProductLogs paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  ProductLog.findAndCountAll({
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
 * @typedef {object} ProductLogCreationData
 * @property {string} productId
 * @property {integer} qty
 * @property {number} costPrice
 * @property {string} actionType
 */

/**
 * POST /api/product-logs
 * @summary Create new ProductLog
 * @tags ProductLogs
 * @security JWT
 * @param {ProductLogCreationData} request.body.required - ProductLog data
 * @return {ProductLog} 200 - Created ProductLog
 */
router.post('/', (req, res, next) => {
  ProductLog.create(pick(req.body, [
    'productId',
    'qty',
    'costPrice',
    'actionType',
  ]))
    .then((productLog) => res.json(productLog))
    .catch(next);
});


/**
 * GET /api/product-logs/{id}
 * @summary Get single ProductLog
 * @tags ProductLogs
 * @security JWT
 * @param {string} id.path.required
 * @return {ProductLog} 200 - ProductLog
 */
router.get('/:id', (req, res, next) =>
  ProductLog.findByPk(req.params.id)
    .then((productLog) => res.json(productLog))
    .catch(next)
);

/**
 * PATCH /api/product-logs/{id}
 * @summary Update single ProductLog
 * @tags ProductLogs
 * @security JWT
 * @param {string} id.path.required
 * @param {ProductLogCreationData} request.body.required
 * @return {ProductLog} 200 - Updated ProductLog
 */
router.patch('/:id', (req, res, next) =>
  ProductLog.update(
    pick(req.body, [
      'productId',
      'qty',
      'costPrice',
      'actionType',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [productLog]]) => res.json(productLog))
    .catch(next)
);

/**
 * DELETE /api/product-logs/{id}
 * @summary Delete single ProductLog
 * @tags ProductLogs
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  ProductLog.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
