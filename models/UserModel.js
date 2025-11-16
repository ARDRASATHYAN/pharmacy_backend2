const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');


const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(150),
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Manager', 'Pharmacist', 'Billing', 'StoreKeeper'),
        defaultValue: 'Billing',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'users',
        timestamps: false, // already handled manually in DB
    }
);

//  Hash password before creating
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

//  Hash password before updating (if changed)
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});


module.exports = User;