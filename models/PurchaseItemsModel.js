const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PurchaseInvoice = require('./PurchaseInvoicesModel');
const Item = require('./ItemsModel');


const PurchaseItems = sequelize.define('PurchaseItems', {
  purchase_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  batch_no: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  pack_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  qty: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  purchase_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  mrp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  gst_percent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  discount_percent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  purchase_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PurchaseInvoice, // ✅ reference model, not string
      key: 'purchase_id',
    },
    onDelete: 'CASCADE',
  },
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Item, // ✅ reference model, not string
      key: 'item_id',
    },
    allowNull: true,
  },
}, {
  tableName: 'purchase_items',
  timestamps: false,
});

// ✅ Associations
PurchaseItems.belongsTo(PurchaseInvoice, {
  foreignKey: 'purchase_id',
  as: 'invoice', 
});

PurchaseItems.belongsTo(Item, {
  foreignKey: 'item_id',
  as: 'item', 
});

module.exports = PurchaseItems;
