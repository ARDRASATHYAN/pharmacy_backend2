const { Op } = require('sequelize');
const User = require("../models/UserModel");

//  Get all users with search, filter, and pagination
exports.getAllUsers = async (req, res) => {
  try {
    const {
      search = '',        // for search (e.g., username, full_name)
      role,               // filter by role
      is_active,          // filter by status
      sortBy = 'user_id', // sorting field
      order = 'ASC'       // ASC / DESC
    } = req.query;

    const where = {};

    //  Search (by username or full_name)
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { full_name: { [Op.like]: `%${search}%` } },
      ];
    }

    //Role filter
    if (role) {
      where.role = role;
    }

    // Active / Inactive filter
    if (is_active !== undefined) {
      if (is_active === 'true' || is_active === '1') where.is_active = true;
      if (is_active === 'false' || is_active === '0') where.is_active = false;
    }

    

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      attributes: { exclude: ['password_hash'] },
    });

    res.json({
      success: true,
      data: users,
     
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }

};
// exports.getAllUsers = async (req, res) => {
//   try {
//     const {
//       search = "",           // search by username / full_name
//       role,                  // filter by role
//       is_active,             // filter by status
//       sortBy = "user_id",    // sort field
//       order = "ASC",         // ASC / DESC
//       page = 1,              // current page
//       limit = 10             // number of rows per page (frontend controls)
//     } = req.query;

//     // Build filter
//     const where = {};

//     if (search) {
//       where[Op.or] = [
//         { username: { [Op.like]: `%${search}%` } },
//         { full_name: { [Op.like]: `%${search}%` } },
//       ];
//     }

//     if (role) where.role = role;

//     if (is_active !== undefined) {
//       where.is_active = is_active === "true" || is_active === "1";
//     }

//     // Pagination
//     const offset = (page - 1) * limit;

//     // Fetch from DB
//     const { rows: users, count: total } = await User.findAndCountAll({
//       where,
//       order: [[sortBy, order.toUpperCase()]],
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       attributes: { exclude: ["password"] }, // exclude password
//     });

//     res.json({
//       success: true,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       total,                     // total matching rows
//       totalPages: Math.ceil(total / limit),
//       data: users,
//     });

//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ success: false, message: "Error fetching users" });
//   }
// };

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, full_name, role, is_active } = req.body;

    const newUser = await User.create({
      username,
      password, // will be hashed by model hook
      full_name,
      role: role || 'Billing',
      is_active: is_active !== undefined ? is_active : true,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { ...newUser.toJSON(), password_hash: undefined },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, full_name, role, is_active } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.update({
      username,
      password, // automatically hashed if changed
      full_name,
      role,
      is_active,
    });

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { user_id: id } });

    if (!deleted)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};
