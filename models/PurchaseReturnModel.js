const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PurchaseInvoice = require('./PurchaseInvoicesModel');
const Store = require('./StoresModel');
const User = require('./UserModel');

const PurchaseReturn = sequelize.define('PurchaseReturn', {
  return_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  purchase_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PurchaseInvoice,
      key: 'purchase_id',
    },
  },
  store_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Store,
      key: 'store_id',
    },
  },
  return_date: {
    type: DataTypes.DATEONLY,
  },
  reason: {
    type: DataTypes.TEXT,
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'purchase_returns',
  timestamps: false,
});

// Associations
PurchaseReturn.belongsTo(PurchaseInvoice, { foreignKey: 'purchase_id', as: 'purchase' });
PurchaseReturn.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
PurchaseReturn.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = PurchaseReturn;
