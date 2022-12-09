module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Zone
   * @property {string} id
   * @property {string} name
   * @property {string} location
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Zone = sequelize.define(
    'Zone',
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
      location: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  Zone.associate = function() {
    // associations can be defined here
  };

  return Zone;
};
