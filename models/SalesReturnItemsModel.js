// models/SalesReturnItemModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const SalesReturn = require("./SalesReturnModel");
const Item = require("./ItemsModel");

const SalesReturnItem = sequelize.define(
  "SalesReturnItem",
  {
    return_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    return_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "sales_returns",
        key: "return_id",
      },
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "items_master",
        key: "item_id",
      },
      allowNull: false,
    },
    batch_no: {
      type: DataTypes.STRING(100),
    },
    qty: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "sales_return_items",
    timestamps: false,
  }
);

SalesReturnItem.belongsTo(SalesReturn, { foreignKey: "return_id", as: "return" });
SalesReturnItem.belongsTo(Item, { foreignKey: "item_id", as: "item" });

module.exports = SalesReturnItem;
