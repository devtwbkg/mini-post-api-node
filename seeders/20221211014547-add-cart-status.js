'use strict';
const { CartType } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await CartType.findOrCreate({
      where: { name: 'INPROGRESS' },
      defaults: {
        name: 'INPROGRESS',
      },
    });

    await CartType.findOrCreate({
      where: { name: 'SUCCESS' },
      defaults: {
        name: 'SUCCESS',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    CartType.delete({
      where: { name: 'INPROGRESS' },
    });
    CartType.delete({
      where: { name: 'SUCCESS' },
    });
  }
};
