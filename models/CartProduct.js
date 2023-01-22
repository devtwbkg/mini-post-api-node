const Cart = require('./Cart');

module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} CartProduct
   * @property {string} id
   * @property {string} cartId
   * @property {string} productId
   * @property {integer} qty
   * @property {number} retailPrice
   * @property {number} costPrice
   * @property {number} discount
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const CartProduct = sequelize.define(
    'CartProduct',
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.UUIDV1,
        references: {
          model: Cart, // 'Actors' would also work
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.UUIDV1,
      },
      qty: {
        type: DataTypes.INTEGER,
      },
      retailPrice: {
        type: DataTypes.FLOAT,
      },
      costPrice: {
        type: DataTypes.FLOAT,
      },
      discount: {
        type: DataTypes.FLOAT,
      },
    },
    {}
  );
  CartProduct.associate = function (models) {
    // // associations can be defined here
    // CartProduct.hasOne(models.Product, {
    //   through: 'Product',
    //   as: 'product',
    //   foreignKey: {
    //     name: 'id',
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //   },
    //   sourceKey: 'productId',
    // });
    CartProduct.belongsTo(models.Product, {
      through: 'CartProductProduct',
      as: 'product',
      foreignKey: 'productId', // replaces `productId`
      targetKey: 'id',
    });
  };

  return CartProduct;
};
