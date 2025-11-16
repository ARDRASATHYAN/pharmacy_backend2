// models/RefreshTokenModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./UserModel');

const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  token: { type: DataTypes.STRING(255), allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  user_agent: { type: DataTypes.STRING(255), allowNull: true },
  ip_address: { type: DataTypes.STRING(45), allowNull: true },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
  replaced_by: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'refresh_tokens',
  timestamps: false,
});

RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
module.exports = RefreshToken;
