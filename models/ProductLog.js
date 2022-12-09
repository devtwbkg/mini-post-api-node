module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} ProductLog
   * @property {string} id
   * @property {string} productId
   * @property {integer} qty
   * @property {number} costPrice
   * @property {string} actionType
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const ProductLog = sequelize.define(
    'ProductLog',
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.STRING,
      },
      qty: {
        type: DataTypes.INTEGER,
      },
      costPrice: {
        type: DataTypes.FLOAT,
      },
      actionType: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  ProductLog.associate = function() {
    // associations can be defined here
  };

  return ProductLog;
};
