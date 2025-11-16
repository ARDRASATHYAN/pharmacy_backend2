const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Store = sequelize.define('Store', {
    store_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    store_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,  
    },
    city: {
        type: DataTypes.STRING(100),
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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'stores',
        timestamps: false, // already handled manually in DB
    }
);

//  Hash password before creating



module.exports = Store;