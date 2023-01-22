const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT, JWT_BEARER } = require('../config/constants');
const { BlackList } = require('../models');

router.all('*', passport.authenticate(`${JWT_BEARER}`));


/**
 * @typedef {object} BlackListPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<BlackList>} data
 */

/**
 * GET /api/black-lists
 * @summary Get BlackLists list
 * @tags BlackLists
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {BlackListPaginated} 200 - BlackLists paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  BlackList.findAndCountAll({
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
 * @typedef {object} BlackListCreationData
 * @property {string} customerId
 * @property {string} dealerId
 * @property {string} name
 * @property {string} remark
 */

/**
 * POST /api/black-lists
 * @summary Create new BlackList
 * @tags BlackLists
 * @security JWT
 * @param {BlackListCreationData} request.body.required - BlackList data
 * @return {BlackList} 200 - Created BlackList
 */
router.post('/', (req, res, next) => {
  BlackList.create(pick(req.body, [
    'customerId',
    'dealerId',
    'name',
    'remark',
  ]))
    .then((blackList) => res.json(blackList))
    .catch(next);
});


/**
 * GET /api/black-lists/{id}
 * @summary Get single BlackList
 * @tags BlackLists
 * @security JWT
 * @param {string} id.path.required
 * @return {BlackList} 200 - BlackList
 */
router.get('/:id', (req, res, next) =>
  BlackList.findByPk(req.params.id)
    .then((blackList) => res.json(blackList))
    .catch(next)
);

/**
 * PATCH /api/black-lists/{id}
 * @summary Update single BlackList
 * @tags BlackLists
 * @security JWT
 * @param {string} id.path.required
 * @param {BlackListCreationData} request.body.required
 * @return {BlackList} 200 - Updated BlackList
 */
router.patch('/:id', (req, res, next) =>
  BlackList.update(
    pick(req.body, [
      'customerId',
      'dealerId',
      'name',
      'remark',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [blackList]]) => res.json(blackList))
    .catch(next)
);

/**
 * DELETE /api/black-lists/{id}
 * @summary Delete single BlackList
 * @tags BlackLists
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  BlackList.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
