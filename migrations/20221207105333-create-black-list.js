module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('BlackLists', {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.literal('uuid_generate_v1()'),
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('BlackLists');
  },
};
