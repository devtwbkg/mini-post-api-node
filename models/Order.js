module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Order
   * @property {string} id
   * @property {string} customerId
   * @property {string} orderStatus
   * @property {string} paymentMethod
   * @property {string} shippingMethod
   * @property {integer} redeemPoint
   * @property {string} usePromoCode
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV1,
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
    },
    {}
  );
  Order.associate = function() {
    // associations can be defined here
  };

  return Order;
};
