const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const DrugSchedule = sequelize.define('DrugSchedule', {
    schedule_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    schedule_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    schedule_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    requires_prescription: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    restricted_sale: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'drug_schedule_master', 
    timestamps: false,        
});

module.exports = DrugSchedule;
