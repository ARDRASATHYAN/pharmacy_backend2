const DrugSchedule = require("../models/DrugScheduleModel");


// ✅ Get all drug schedules
exports.getAllDrugSchedules = async (req, res) => {
  try {
    const data = await DrugSchedule.findAll({ order: [['schedule_id', 'ASC']] });
    res.json(data);
  } catch (error) {
    console.error('Error fetching drug schedules:', error);
    res.status(500).json({ message: 'Error fetching drug schedules' });
  }
};

// ✅ Get a single schedule by ID
exports.getDrugScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await DrugSchedule.findByPk(id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule by ID:', error);
    res.status(500).json({ message: 'Error fetching schedule' });
  }
};

// ✅ Create new drug schedule
exports.createDrugSchedule = async (req, res) => {
  try {
    const { schedule_code, schedule_name, description, requires_prescription, restricted_sale } = req.body;

    const newSchedule = await DrugSchedule.create({
      schedule_code,
      schedule_name,
      description,
      requires_prescription: requires_prescription || false,
      restricted_sale: restricted_sale || false,
    });

    res.status(201).json({ message: 'Drug schedule created successfully', data: newSchedule });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Error creating schedule' });
  }
};

// ✅ Update existing schedule
exports.updateDrugSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedule_code, schedule_name, description, requires_prescription, restricted_sale } = req.body;

    const schedule = await DrugSchedule.findByPk(id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    await schedule.update({
      schedule_code,
      schedule_name,
      description,
      requires_prescription,
      restricted_sale,
    });

    res.json({ message: 'Drug schedule updated successfully', data: schedule });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Error updating schedule' });
  }
};

// ✅ Delete a schedule
exports.deleteDrugSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DrugSchedule.destroy({ where: { schedule_id: id } });

    if (!deleted) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Drug schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Error deleting schedule' });
  }
};
