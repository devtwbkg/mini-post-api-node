module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Cart
   * @property {string} id
   * @property {string} cartStatus
   * @property {string} errorMessage
   * @property {number} total
   * @property {number} vat
   * @property {number} discount
   * @property {integer} qty
   * @property {string} promoCode
   * @property {number} promoCodeAmount
   * @property {string} promoCodeMessage
   * @property {integer} redeemPoint
   * @property {number} redeemPointAmount
   * @property {string} customerId
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Cart = sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV1,
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
    },
    {}
  );
  Cart.associate = function (models) {
    // associations can be defined here
    // Cart.belongsTo(models.CartProduct, {
    //   as: 'cartItems',
    //   through: 'CartProduct',
    //   foreignKey: 'cartId', // replaces `productId`
    //   sourceKey: 'id', // replaces `categoryId`
    // });
    Cart.belongsTo(models.CartProduct, {
      as: 'cartItems',
      through: 'CartProduct',
      foreignKey: 'id', // replaces `productId`
      targetKey: 'cartId',
    });
  };

  return Cart;
};
