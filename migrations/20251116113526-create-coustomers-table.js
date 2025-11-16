'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      customer_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      email: {
        type: Sequelize.STRING(100),
      },
      gst_no: {
        type: Sequelize.STRING(20),
      },
      doctor_name: {
        type: Sequelize.STRING(150),
      },
      prescription_no: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  },
};
