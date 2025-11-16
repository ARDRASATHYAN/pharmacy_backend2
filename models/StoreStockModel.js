const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Store = require('./StoresModel');
const Item = require('./ItemsModel');

const StoreStock = sequelize.define(
  'StoreStock',
  {
    stock_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    expiry_date: {
      type: DataTypes.DATE,
    },
    batch_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
    },
    purchase_rate: {
      type: DataTypes.DECIMAL(10, 2),
    },
    sale_rate: {
      type: DataTypes.DECIMAL(10, 2),
    },
    gst_percent: {
      type: DataTypes.DECIMAL(5, 2),
    },
    qty_in_stock: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    store_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'stores',
        key: 'store_id',
      },
      allowNull: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'items_master',
        key: 'item_id',
      },
      allowNull: true,
    },
  },
  {
    tableName: 'store_stock',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['store_id', 'item_id', 'batch_no'], // composite unique
      },
    ],
  }
);

// Associations
StoreStock.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
StoreStock.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

module.exports = StoreStock;
