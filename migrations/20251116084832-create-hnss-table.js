'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hsn_master', {
      hsn_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      hsn_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
      },
      gst_percent: {
        type: Sequelize.DECIMAL(5, 2),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hsn_master');
  }
};
