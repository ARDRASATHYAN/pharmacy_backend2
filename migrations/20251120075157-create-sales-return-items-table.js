"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sales_return_items", {
      return_item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      return_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "sales_returns",
          key: "return_id",
        },
        onDelete: "CASCADE",
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "items_master",
          key: "item_id",
        },
      },
      batch_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sales_return_items");
  },
};
