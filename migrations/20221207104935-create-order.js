module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Orders', {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.literal('uuid_generate_v1()'),
        allowNull: false,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING,
      },
      orderStatus: {
        type: DataTypes.STRING,
      },
      paymentMethod: {
        type: DataTypes.STRING,
      },
      shippingMethod: {
        type: DataTypes.STRING,
      },
      redeemPoint: {
        type: DataTypes.INTEGER,
      },
      usePromoCode: {
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
    return queryInterface.dropTable('Orders');
  },
};
