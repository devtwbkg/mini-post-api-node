module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} CartType
   * @property {string} id
   * @property {string} name
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const CartType = sequelize.define(
    'CartType',
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
    },
    {}
  );
  CartType.associate = function() {
    // associations can be defined here
  };

  return CartType;
};
