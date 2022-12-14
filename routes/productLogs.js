const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { sequelize } = require('../config/db');
const { ProductLog, Product } = require('../models');

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
router.post('/', async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const productLog = await ProductLog.create(
      pick(req.body, ['productId', 'qty', 'costPrice', 'actionType']),
      {
        transaction,
      }
    );

    if (productLog === null || productLog === undefined) {
      throw new Error(`product log can not save.`);
    }
    const product = await Product.findByPk(req.body.productId);
    if (product === null || product === undefined) {
      throw new Error(`product ${req.body.productId} not found.`);
    }

    const constPrice = product.costPrice + req.body.costPrice;
    const qty = product.qty + req.body.qty;
    product.qty = qty;
    product.costPrice = constPrice / qty;
    const productUpdated = Product.update(product, {
      where: { id: req.body.productId },
      returning: true,
      transaction,
    });

    if (productUpdated === null || productUpdated === undefined) {
      await transaction.rollback();
      throw new Error(`product can not update.`);
    }

    await transaction.commit();

    return res.json(productLog);
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
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
    pick(req.body, ['productId', 'qty', 'costPrice', 'actionType']),
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
