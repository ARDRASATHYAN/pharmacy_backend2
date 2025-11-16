'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('store_stock', {
      stock_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      expiry_date: {
        type: Sequelize.DATE,
      },
      batch_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mrp: {
        type: Sequelize.DECIMAL(10, 2),
      },
      purchase_rate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      sale_rate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      gst_percent: {
        type: Sequelize.DECIMAL(5, 2),
      },
      qty_in_stock: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      store_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'stores',
          key: 'store_id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items_master',
          key: 'item_id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Composite unique constraint
    await queryInterface.addConstraint('store_stock', {
      fields: ['store_id', 'item_id', 'batch_no'],
      type: 'unique',
      name: 'store_item_batch_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('store_stock');
  },
};
