const {
  DEFAULT_CUSTOMER_CODE,
  DEFAULT_CUSTOMER_NAME,
} = require('../config/constants');
const { Customer } = require('../models');

module.exports = {
  up: () =>
    Customer.findOrCreate({
      where: { customerCode: DEFAULT_CUSTOMER_CODE },
      defaults: {
        name: DEFAULT_CUSTOMER_NAME,
        customerCode: DEFAULT_CUSTOMER_CODE,
        // role: ROLES.ADMIN,
      },
    }),

  down: () =>
    Customer.delete({
      where: { customerCode: DEFAULT_CUSTOMER_CODE },
    }),
};
