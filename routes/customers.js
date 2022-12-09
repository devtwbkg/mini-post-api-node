const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { Customer } = require('../models');

router.all('*', passport.authenticate('jwt'));


/**
 * @typedef {object} CustomerPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Customer>} data
 */

/**
 * GET /api/customers
 * @summary Get Customers list
 * @tags Customers
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {CustomerPaginated} 200 - Customers paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Customer.findAndCountAll({
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
 * @typedef {object} CustomerCreationData
 * @property {string} name
 * @property {string} customerCode
 */

/**
 * POST /api/customers
 * @summary Create new Customer
 * @tags Customers
 * @security JWT
 * @param {CustomerCreationData} request.body.required - Customer data
 * @return {Customer} 200 - Created Customer
 */
router.post('/', (req, res, next) => {
  Customer.create(pick(req.body, [
    'name',
    'customerCode',
  ]))
    .then((customer) => res.json(customer))
    .catch(next);
});


/**
 * GET /api/customers/{id}
 * @summary Get single Customer
 * @tags Customers
 * @security JWT
 * @param {string} id.path.required
 * @return {Customer} 200 - Customer
 */
router.get('/:id', (req, res, next) =>
  Customer.findByPk(req.params.id)
    .then((customer) => res.json(customer))
    .catch(next)
);

/**
 * PATCH /api/customers/{id}
 * @summary Update single Customer
 * @tags Customers
 * @security JWT
 * @param {string} id.path.required
 * @param {CustomerCreationData} request.body.required
 * @return {Customer} 200 - Updated Customer
 */
router.patch('/:id', (req, res, next) =>
  Customer.update(
    pick(req.body, [
      'name',
      'customerCode',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [customer]]) => res.json(customer))
    .catch(next)
);

/**
 * DELETE /api/customers/{id}
 * @summary Delete single Customer
 * @tags Customers
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Customer.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
