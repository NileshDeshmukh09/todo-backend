const User = require('../models/User');
const logger = require('../utils/logger');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('username email');
    res.json(users);
  } catch (error) {
    logger.error('Error getting users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    logger.error('Error getting user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this username or email already exists' 
      });
    }

    const user = new User({ username, email });
    await user.save();
    
    logger.info(`New user created: ${username}`);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser
}; 