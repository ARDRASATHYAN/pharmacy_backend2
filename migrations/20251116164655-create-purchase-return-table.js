'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_returns', {
      return_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      purchase_id: {
        type: Sequelize.INTEGER,
        references: { model: 'purchase_invoices', key: 'purchase_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      store_id: {
        type: Sequelize.INTEGER,
        references: { model: 'stores', key: 'store_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      return_date: {
        type: Sequelize.DATEONLY,
      },
      reason: {
        type: Sequelize.TEXT,
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_returns');
  }
};
