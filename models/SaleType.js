module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} SaleType
   * @property {string} id
   * @property {string} name
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const SaleType = sequelize.define(
    'SaleType',
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
  SaleType.associate = function() {
    // associations can be defined here
  };

  return SaleType;
};
