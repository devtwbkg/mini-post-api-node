module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Images
   * @property {string} id
   * @property {string} name
   * @property {string} ownerId
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Images = sequelize.define(
    'Images',
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
      ownerId: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  Images.associate = function (models) {
  };

  return Images;
};
