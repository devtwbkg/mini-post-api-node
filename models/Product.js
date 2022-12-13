module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Product
   * @property {string} id
   * @property {string} code
   * @property {string} name
   * @property {string} description
   * @property {integer} qty
   * @property {number} costPrice
   * @property {number} salePrice
   * @property {string} imageId
   * @property {string} categoryId
   * @property {string} zoneId
   * @property {string} unitId
   * @property {string} expiredDate
   * @property {string} createdAt Date ISO format
   * @property {string} updatedAt Date ISO format
   */
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV1,
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
        allowNull: false,
      },
      costPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      retailPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      wholesalePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
        allowNull: false,
      },
      expiredDate: {
        type: DataTypes.DATE,
      },
    },
    {}
  );
  Product.associate = function (models) {
    Product.belongsTo(models.Unit, {
      as: 'unit',
      through: 'ProductUnit',
      foreignKey: 'unitId',
      targetKey: 'id',
    });

    Product.belongsTo(models.Zone, {
      as: 'zone',
      through: 'ProductZone',
      foreignKey: 'zoneId',
      targetKey: 'id',
    });

    Product.belongsTo(models.Category, {
      as: 'category',
      through: 'ProductCategory',
      foreignKey: 'categoryId',
      targetKey: 'id',
    });

    Product.belongsToMany(models.Images, {
      as: 'images',
      through: 'Images',
      foreignKey: 'ownerId',
      otherKey: 'id',
    });
  };

  return Product;
};
