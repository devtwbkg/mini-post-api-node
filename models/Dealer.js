module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Dealer
   * @property {string} id
   * @property {string} name
   * @property {string} contact
   * @property {string} phoneNumber
   * @property {string} address
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Dealer = sequelize.define(
    'Dealer',
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
      contact: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING(10),
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  Dealer.associate = function() {
    // associations can be defined here
  };

  return Dealer;
};
