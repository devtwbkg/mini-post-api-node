const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT,BEARER_KEY } = require('../config/constants');
const { Zone } = require('../models');

router.all('*', passport.authenticate(BEARER_KEY));


/**
 * @typedef {object} ZonePaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Zone>} data
 */

/**
 * GET /api/zones
 * @summary Get Zones list
 * @tags Zones
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {ZonePaginated} 200 - Zones paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Zone.findAndCountAll({
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
 * @typedef {object} ZoneCreationData
 * @property {string} name
 * @property {string} location
 */

/**
 * POST /api/zones
 * @summary Create new Zone
 * @tags Zones
 * @security JWT
 * @param {ZoneCreationData} request.body.required - Zone data
 * @return {Zone} 200 - Created Zone
 */
router.post('/', (req, res, next) => {
  Zone.create(pick(req.body, [
    'name',
    'location',
  ]))
    .then((zone) => res.json(zone))
    .catch(next);
});


/**
 * GET /api/zones/{id}
 * @summary Get single Zone
 * @tags Zones
 * @security JWT
 * @param {string} id.path.required
 * @return {Zone} 200 - Zone
 */
router.get('/:id', (req, res, next) =>
  Zone.findByPk(req.params.id)
    .then((zone) => res.json(zone))
    .catch(next)
);

/**
 * PATCH /api/zones/{id}
 * @summary Update single Zone
 * @tags Zones
 * @security JWT
 * @param {string} id.path.required
 * @param {ZoneCreationData} request.body.required
 * @return {Zone} 200 - Updated Zone
 */
router.patch('/:id', (req, res, next) =>
  Zone.update(
    pick(req.body, [
      'name',
      'location',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [zone]]) => res.json(zone))
    .catch(next)
);

/**
 * DELETE /api/zones/{id}
 * @summary Delete single Zone
 * @tags Zones
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Zone.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
