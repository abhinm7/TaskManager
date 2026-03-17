const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { createTask, getTasks, updateTask, deleteTask} = require('../controllers/taskController');

// Apply the authentication middleware
router.use(requireAuth);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;