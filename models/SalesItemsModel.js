const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Item = require("./ItemsModel");
const SalesInvoices = require("./SalesInvoicesModel");

const SalesItems = sequelize.define(
    "SalesItems", {
    sale_item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sale_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'sales_invoices',
            key: 'sale_id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'items_master',
            key: 'item_id',
        },
        allowNull: false,
    },
    batch_no: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    qty: {
        type: DataTypes.DECIMAL(10, 2),
    },
    rate: {
        type: DataTypes.DECIMAL(10, 2),
    },
    gst_percent: {
        type: DataTypes.DECIMAL(5, 2),
    },
    discount_percent: {
        type: DataTypes.DECIMAL(5, 2),
    },
    total_amount: {
        type: DataTypes.DECIMAL(12, 2),
    },
},
    {
        tableName: 'sales_items',
        timestamps: false
    }
)
SalesItems.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
SalesItems.belongsTo(SalesInvoices, { foreignKey: 'sale_id', as: "invoice" });

module.exports = SalesItems