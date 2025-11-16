const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const HSN = sequelize.define('HSN', {
  hsn_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  hsn_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
  },
 gst_percent: {
    type: DataTypes.DECIMAL(5, 2),
  },
}, {
  tableName: 'hsn_master', // table name in MySQL
  timestamps: false,        // disable createdAt / updatedAt
});

module.exports = HSN;
