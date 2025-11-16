const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const HSN = require('./HsnModel');
const DrugSchedule = require('./DrugScheduleModel');

const Item = sequelize.define(
  'Item',
  {
    item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    barcode: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    generic_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    manufacturer: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    hsn_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hsn_master',
        key: 'hsn_id',
      },
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'drug_schedule_master',
        key: 'schedule_id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    item_type: {
      type: DataTypes.ENUM('Medicine', 'OTC', 'Consumable', 'Accessory', 'Other'),
      defaultValue: 'Medicine',
    },
    pack_size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'items_master',
    timestamps: true, // Sequelize will handle created_at / updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations
Item.belongsTo(HSN, {
  foreignKey: 'hsn_id',
  as: 'hsn',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Item.belongsTo(DrugSchedule, {
  foreignKey: 'schedule_id',
  as: 'schedule',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

module.exports = Item;
