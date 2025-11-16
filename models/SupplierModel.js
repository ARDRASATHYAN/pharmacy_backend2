const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define(
  'Supplier',
  {
    supplier_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supplier_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    state: {
      type: DataTypes.STRING(100),
    },
    gst_no: {
      type: DataTypes.STRING(20),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: 'suppliers',
    timestamps: true, // Sequelize will handle created_at / updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Supplier;
