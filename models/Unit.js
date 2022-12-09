module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Unit
   * @property {string} id
   * @property {string} name
   * @property {integer} qty
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Unit = sequelize.define(
    'Unit',
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
      qty: {
        type: DataTypes.INTEGER,
      },
    },
    {}
  );
  Unit.associate = function() {
    // associations can be defined here
  };

  return Unit;
};
