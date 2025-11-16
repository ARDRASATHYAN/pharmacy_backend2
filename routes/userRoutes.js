const express = require('express');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const userRouter = express.Router();


// Routes
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

module.exports = userRouter;
