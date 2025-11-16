const cron = require('node-cron');
const RefreshToken = require('../models/RefreshTokenModel');
const { Op } = require('sequelize');

function startCleanupJob() {
  // Schedule: every day at 2 AM
  cron.schedule('49 16 * * *', async () => {
    try {
      const deleted = await RefreshToken.destroy({
        where: {
          [Op.or]: [
            { revoked: true }, // revoked tokens
            { expires_at: { [Op.lt]: new Date() } }, // expired tokens
          ], // only expired tokens
        },
      });
      if (deleted) console.log(`🧹 Cleaned up ${deleted} old revoked tokens`);
    } catch (err) {
      console.error('❌ Cleanup job error:', err);
    }
  });
}

module.exports = startCleanupJob;
