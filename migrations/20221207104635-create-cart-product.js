module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('CartProducts', {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.literal('uuid_generate_v1()'),
        allowNull: false,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.STRING,
      },
      productId: {
        type: DataTypes.STRING,
      },
      qty: {
        type: DataTypes.INTEGER,
      },
      salePrice: {
        type: DataTypes.FLOAT,
      },
      costPrice: {
        type: DataTypes.FLOAT,
      },
      discount: {
        type: DataTypes.FLOAT,
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
    return queryInterface.dropTable('CartProducts');
  },
};
