'use strict';
const { RETAIL, WHOLESALE } = require('../config/constants');
const { SaleType } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     *
     */
    await SaleType.findOrCreate({
      where: { name: WHOLESALE },
      defaults: {
        name: WHOLESALE,
      },
    });

    await SaleType.findOrCreate({
      where: { name: RETAIL },
      defaults: {
        name: RETAIL,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    SaleType.delete({
      where: { name: RETAIL },
    });
    SaleType.delete({
      where: { name: RETAIL },
    });
  },
};
