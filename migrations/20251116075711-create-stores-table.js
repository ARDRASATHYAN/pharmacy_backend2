'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stores', {
      store_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      store_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.STRING(100),
      },
      state: {
        type: Sequelize.STRING(100),
      },
      gst_no: {
        type: Sequelize.STRING(20),
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      email: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stores');
  }
};
