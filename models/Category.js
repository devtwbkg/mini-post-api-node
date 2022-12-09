module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Category
   * @property {string} id
   * @property {string} name
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Category = sequelize.define(
    'Category',
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
  Category.associate = function() {
    // associations can be defined here
  };

  return Category;
};
