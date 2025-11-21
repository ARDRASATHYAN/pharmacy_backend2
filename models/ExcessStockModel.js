const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Store = require("./StoresModel");
const Item = require("./ItemsModel");
const User = require("./UserModel");

const ExcessStock=sequelize.define("ExcessStock",
    {
        excess_id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },       
    store_id :{
        type:DataTypes.INTEGER,
        references:{
            model:Store,
            key:"store_id",
        },
        allowNull:false,
    },
    item_id :{
        type:DataTypes.INTEGER,
        references:{
            model:Item,
            key:"item_id",
        },
        allowNull:false,
    },
    batch_no :{
        type:DataTypes.STRING(100),
        allowNull:false,
    },
    qty :{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
    },
    reason :{
        type:DataTypes.TEXT
    },
    entry_date :{
        type:DataTypes.DATE,
    },
    created_by :{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"user_id"
        },
        allowNull:false,
    },
},
{
    tableName:"excess_stock",
    timestamps:true,
    createdAt:"created_at",
    updatedAt:false
}
);
ExcessStock.belongsTo(Store,{foreignKey:"store_id", as: "store"});
ExcessStock.belongsTo(Item,{foreignKey:'item_id',as:"item"});
ExcessStock.belongsTo(User,{foreignKey:"created_by",as:"user"});

module.exports=ExcessStock