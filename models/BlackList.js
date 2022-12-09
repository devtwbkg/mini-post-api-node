module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} BlackList
   * @property {string} id
   * @property {string} customerId
   * @property {string} dealerId
   * @property {string} name
   * @property {string} remark
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const BlackList = sequelize.define(
    'BlackList',
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING,
      },
      dealerId: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      remark: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );
  BlackList.associate = function() {
    // associations can be defined here
  };

  return BlackList;
};
