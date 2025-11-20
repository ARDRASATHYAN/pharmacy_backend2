"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sales_invoices", {
      sale_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "stores",        // table name
          key: "store_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "customers",     // table name
          key: "customer_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      bill_no: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      bill_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      total_gst: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      total_discount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      net_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      doctor_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      prescription_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",         // table name
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      // updatedAt is disabled in the model, so no updated_at column
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sales_invoices");
  },
};
