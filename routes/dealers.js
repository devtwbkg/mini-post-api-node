const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT, BEARER_KEY } = require('../config/constants');
const { Dealer } = require('../models');

router.all('*', passport.authenticate(BEARER_KEY));


/**
 * @typedef {object} DealerPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Dealer>} data
 */

/**
 * GET /api/dealers
 * @summary Get Dealers list
 * @tags Dealers
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {DealerPaginated} 200 - Dealers paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Dealer.findAndCountAll({
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
 * @typedef {object} DealerCreationData
 * @property {string} name
 * @property {string} contact
 * @property {string} phoneNumber
 * @property {string} address
 */

/**
 * POST /api/dealers
 * @summary Create new Dealer
 * @tags Dealers
 * @security JWT
 * @param {DealerCreationData} request.body.required - Dealer data
 * @return {Dealer} 200 - Created Dealer
 */
router.post('/', (req, res, next) => {
  Dealer.create(pick(req.body, [
    'name',
    'contact',
    'phoneNumber',
    'address',
  ]))
    .then((dealer) => res.json(dealer))
    .catch(next);
});


/**
 * GET /api/dealers/{id}
 * @summary Get single Dealer
 * @tags Dealers
 * @security JWT
 * @param {string} id.path.required
 * @return {Dealer} 200 - Dealer
 */
router.get('/:id', (req, res, next) =>
  Dealer.findByPk(req.params.id)
    .then((dealer) => res.json(dealer))
    .catch(next)
);

/**
 * PATCH /api/dealers/{id}
 * @summary Update single Dealer
 * @tags Dealers
 * @security JWT
 * @param {string} id.path.required
 * @param {DealerCreationData} request.body.required
 * @return {Dealer} 200 - Updated Dealer
 */
router.patch('/:id', (req, res, next) =>
  Dealer.update(
    pick(req.body, [
      'name',
      'contact',
      'phoneNumber',
      'address',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [dealer]]) => res.json(dealer))
    .catch(next)
);

/**
 * DELETE /api/dealers/{id}
 * @summary Delete single Dealer
 * @tags Dealers
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Dealer.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
