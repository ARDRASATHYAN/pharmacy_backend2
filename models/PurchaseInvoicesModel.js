const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Store = require('./StoresModel');
const Supplier = require('./SupplierModel');
const User = require('./UserModel');

const PurchaseInvoice = sequelize.define(
  'PurchaseInvoice',
  {
    purchase_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: false,
    },
    total_gst: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: false,
    },
    total_discount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: false,
    },
    net_amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: false,
    },
    store_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'stores', // table name in DB
        key: 'store_id',
      },
      allowNull: true,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'suppliers',
        key: 'supplier_id',
      },
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
      allowNull: true,
    },
  },
  {
    tableName: 'purchase_invoices',
    timestamps: true,           // ✅ Sequelize will auto-manage createdAt / updatedAt
    createdAt: 'created_at',    // map to your DB column
    updatedAt: 'updated_at',    // map to your DB column
  }
);

// ✅ Associations
PurchaseInvoice.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
PurchaseInvoice.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
PurchaseInvoice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = PurchaseInvoice;
