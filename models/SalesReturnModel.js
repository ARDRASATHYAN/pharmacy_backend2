// models/SalesReturnModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Store = require("./StoresModel");
const User = require("./UserModel");
const SalesInvoice = require("./SalesInvoicesModel");

const SalesReturn = sequelize.define(
  "SalesReturn",
  {
    return_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "sales_invoices",
        key: "sale_id",
      },
      allowNull: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "stores",
        key: "store_id",
      },
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
      allowNull: true,
    },
  },
  {
    tableName: "sales_returns",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

SalesReturn.belongsTo(Store, { foreignKey: "store_id", as: "store" });
SalesReturn.belongsTo(User, { foreignKey: "created_by", as: "creator" });
SalesReturn.belongsTo(SalesInvoice, { foreignKey: "sale_id", as: "sale" });

module.exports = SalesReturn;
