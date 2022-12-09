module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Carts', {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.literal('uuid_generate_v1()'),
        allowNull: false,
        primaryKey: true,
      },
      cartStatus: {
        type: DataTypes.STRING,
      },
      errorMessage: {
        type: DataTypes.STRING,
      },
      total: {
        type: DataTypes.FLOAT,
      },
      vat: {
        type: DataTypes.FLOAT,
      },
      discount: {
        type: DataTypes.FLOAT,
      },
      qty: {
        type: DataTypes.INTEGER,
      },
      promoCode: {
        type: DataTypes.STRING,
      },
      promoCodeAmount: {
        type: DataTypes.FLOAT,
      },
      promoCodeMessage: {
        type: DataTypes.STRING,
      },
      redeemPoint: {
        type: DataTypes.INTEGER,
      },
      redeemPointAmount: {
        type: DataTypes.FLOAT,
      },
      customerId: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Carts');
  },
};
