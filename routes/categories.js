const router = require('express').Router();
const passport = require('passport');
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { Category } = require('../models');

router.all('*', passport.authenticate('jwt'));


/**
 * @typedef {object} CategoryPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Category>} data
 */

/**
 * GET /api/categories
 * @summary Get Categories list
 * @tags Categories
 * @security JWT
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {CategoryPaginated} 200 - Categories paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Category.findAndCountAll({
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
 * @typedef {object} CategoryCreationData
 * @property {string} name
 */

/**
 * POST /api/categories
 * @summary Create new Category
 * @tags Categories
 * @security JWT
 * @param {CategoryCreationData} request.body.required - Category data
 * @return {Category} 200 - Created Category
 */
router.post('/', (req, res, next) => {
  Category.create(pick(req.body, [
    'name',
  ]))
    .then((category) => res.json(category))
    .catch(next);
});


/**
 * GET /api/categories/{id}
 * @summary Get single Category
 * @tags Categories
 * @security JWT
 * @param {string} id.path.required
 * @return {Category} 200 - Category
 */
router.get('/:id', (req, res, next) =>
  Category.findByPk(req.params.id)
    .then((category) => res.json(category))
    .catch(next)
);

/**
 * PATCH /api/categories/{id}
 * @summary Update single Category
 * @tags Categories
 * @security JWT
 * @param {string} id.path.required
 * @param {CategoryCreationData} request.body.required
 * @return {Category} 200 - Updated Category
 */
router.patch('/:id', (req, res, next) =>
  Category.update(
    pick(req.body, [
      'name',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [category]]) => res.json(category))
    .catch(next)
);

/**
 * DELETE /api/categories/{id}
 * @summary Delete single Category
 * @tags Categories
 * @security JWT
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Category.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
