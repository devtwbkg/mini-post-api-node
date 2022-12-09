module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Dealers', {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.literal('uuid_generate_v1()'),
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
    return queryInterface.dropTable('Dealers');
  },
};
