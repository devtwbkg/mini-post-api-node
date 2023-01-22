const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT, BEARER_KEY } = require('../config/constants');
const { Unit } = require('../models');

router.all('*', passport.authenticate(BEARER_KEY));


/**
 * @typedef {object} UnitPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Unit>} data
 */

/**
 * GET /api/units
 * @summary Get Units list
 * @tags Units
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {UnitPaginated} 200 - Units paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Unit.findAndCountAll({
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
 * @typedef {object} UnitCreationData
 * @property {string} name
 * @property {integer} qty
 */

/**
 * POST /api/units
 * @summary Create new Unit
 * @tags Units
 * @security JWT
 * @param {UnitCreationData} request.body.required - Unit data
 * @return {Unit} 200 - Created Unit
 */
router.post('/', (req, res, next) => {
  Unit.create(pick(req.body, [
    'name',
    'qty',
  ]))
    .then((unit) => res.json(unit))
    .catch(next);
});


/**
 * GET /api/units/{id}
 * @summary Get single Unit
 * @tags Units
 * @security JWT
 * @param {string} id.path.required
 * @return {Unit} 200 - Unit
 */
router.get('/:id', (req, res, next) =>
  Unit.findByPk(req.params.id)
    .then((unit) => res.json(unit))
    .catch(next)
);

/**
 * PATCH /api/units/{id}
 * @summary Update single Unit
 * @tags Units
 * @security JWT
 * @param {string} id.path.required
 * @param {UnitCreationData} request.body.required
 * @return {Unit} 200 - Updated Unit
 */
router.patch('/:id', (req, res, next) =>
  Unit.update(
    pick(req.body, [
      'name',
      'qty',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [unit]]) => res.json(unit))
    .catch(next)
);

/**
 * DELETE /api/units/{id}
 * @summary Delete single Unit
 * @tags Units
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Unit.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
