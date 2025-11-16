const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // your Sequelize instance
const PurchaseReturn = require('./PurchaseReturnModel');
const Item = require('./ItemsModel');

const PurchaseReturnItem = sequelize.define('PurchaseReturnItem', {
  return_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  return_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // cannot be null
    references: {
      model: PurchaseReturn,
      key: 'return_id',
    },
    onDelete: 'CASCADE', // matches your SQL
    onUpdate: 'CASCADE',
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // cannot be null
    references: {
      model: Item,
      key: 'item_id',
    },
    onDelete: 'NO ACTION', // since your SQL does not specify ON DELETE
    onUpdate: 'CASCADE',
  },
  batch_no: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  qty: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
}, {
  tableName: 'purchase_return_items',
  timestamps: false,
});

// Associations
PurchaseReturnItem.belongsTo(PurchaseReturn, { foreignKey: 'return_id', as: 'purchaseReturn' });
PurchaseReturnItem.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

module.exports = PurchaseReturnItem;
