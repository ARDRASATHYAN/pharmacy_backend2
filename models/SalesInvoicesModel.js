const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Store = require("./StoresModel");
const Customer = require("./CustomerModel");
const User = require("./UserModel");

const SalesInvoices = sequelize.define(
    "SalesInvoices", {
    sale_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bill_no: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    bill_date: {
        type: DataTypes.DATEONLY,
    },
    total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    total_gst: {
        type: DataTypes.DECIMAL(12, 2),
    },
    total_discount: {
        type: DataTypes.DECIMAL(12, 2)
    },
    net_amount: {
        type: DataTypes.DECIMAL(12, 2),
    },
    doctor_name: {
        type: DataTypes.STRING(150),
    },
    prescription_no: {
        type: DataTypes.STRING(100),
    },
    store_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "stores",
            key: 'store_id'
        },
        allowNull: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'customers',
            key: 'customer_id',
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
    }
},
    {
        tableName: 'sales_invoices',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    },

)
SalesInvoices.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
SalesInvoices.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
SalesInvoices.belongsTo(User, { foreignKey: 'created_by', as: 'creater' });

module.exports = SalesInvoices;

