'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_items', {
      purchase_item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      batch_no: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      expiry_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      pack_qty: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      purchase_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      mrp: {
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
      purchase_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'purchase_invoices',
          key: 'purchase_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'items_master',
          key: 'item_id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_items');
  }
};
