module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Customer
   * @property {string} id
   * @property {string} name
   * @property {string} customerCode
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      customerCode: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  Customer.associate = function() {
    // associations can be defined here
  };

  return Customer;
};
