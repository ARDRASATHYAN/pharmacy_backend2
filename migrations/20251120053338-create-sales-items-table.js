"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sales_items", {
      sale_item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sale_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "sales_invoices",   // table name
          key: "sale_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "items_master",     // table name
          key: "item_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",        // or SET NULL / CASCADE, your choice
      },
      batch_no: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      gst_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      discount_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sales_items");
  },
};
