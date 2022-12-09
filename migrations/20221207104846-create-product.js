module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Products', {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.literal('uuid_generate_v1()'),
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      qty: {
        type: DataTypes.INTEGER,
      },
      costPrice: {
        type: DataTypes.FLOAT,
      },
      salePrice: {
        type: DataTypes.FLOAT,
      },
      imageId: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.STRING,
      },
      zoneId: {
        type: DataTypes.STRING,
      },
      unitId: {
        type: DataTypes.STRING,
      },
      expiredDate: {
        type: DataTypes.DATE,
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
    return queryInterface.dropTable('Products');
  },
};
