const express = require('express');
const { getAllDrugSchedules, getDrugScheduleById, createDrugSchedule, updateDrugSchedule, deleteDrugSchedule } = require('../controllers/drugScheduleController');
const drugScheduleRouter = express.Router();


// Routes
drugScheduleRouter.get('/', getAllDrugSchedules);
drugScheduleRouter.get('/:id', getDrugScheduleById);
drugScheduleRouter.post('/', createDrugSchedule);
drugScheduleRouter.put('/:id', updateDrugSchedule);
drugScheduleRouter.delete('/:id', deleteDrugSchedule);

module.exports = drugScheduleRouter;
