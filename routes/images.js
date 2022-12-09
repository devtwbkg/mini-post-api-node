const router = require('express').Router();
const { pick } = require('lodash');
const { DEFAULT_PER_PAGE_COUNT } = require('../config/constants');
const { Images } = require('../models');



/**
 * @typedef {object} ImagesPaginated
 * @property {integer} totalCount
 * @property {integer} pageIndex
 * @property {array<Images>} data
 */

/**
 * GET /api/images
 * @summary Get Images list
 * @tags Images
 * @param {integer} pageIndex.query - eg: 0
 * @param {integer} perPageCount.query - eg: 20
 * @return {ImagesPaginated} 200 - Images paginated list
 */
router.get('/', (req, res, next) => {
  const { pageIndex = 0, perPageCount = DEFAULT_PER_PAGE_COUNT } = req.query;

  Images.findAndCountAll({
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
 * @typedef {object} ImagesCreationData
 * @property {string} name
 * @property {string} ownerId
 */

/**
 * POST /api/images
 * @summary Create new Images
 * @tags Images
 * @param {ImagesCreationData} request.body.required - Images data
 * @return {Images} 200 - Created Images
 */
router.post('/', (req, res, next) => {
  Images.create(pick(req.body, [
    'name',
    'ownerId',
  ]))
    .then((images) => res.json(images))
    .catch(next);
});


/**
 * GET /api/images/{id}
 * @summary Get single Images
 * @tags Images
 * @param {string} id.path.required
 * @return {Images} 200 - Images
 */
router.get('/:id', (req, res, next) =>
  Images.findByPk(req.params.id)
    .then((images) => res.json(images))
    .catch(next)
);

/**
 * PATCH /api/images/{id}
 * @summary Update single Images
 * @tags Images
 * @param {string} id.path.required
 * @param {ImagesCreationData} request.body.required
 * @return {Images} 200 - Updated Images
 */
router.patch('/:id', (req, res, next) =>
  Images.update(
    pick(req.body, [
      'name',
      'ownerId',
    ]),
    {
      where: { id: req.params.id },
      returning: true,
    }
  )
    .then(([count, [images]]) => res.json(images))
    .catch(next)
);

/**
 * DELETE /api/images/{id}
 * @summary Delete single Images
 * @tags Images
 * @param {string} id.path.required
 * @return {integer} 200 - Deleted count
 */
router.delete('/:id', (req, res, next) =>
  Images.destroy({
    where: { id: req.params.id },
  })
    .then((count) => res.json(count))
    .catch(next)
);

module.exports = router;
