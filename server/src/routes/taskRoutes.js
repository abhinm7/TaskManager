const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const { createTask, getTasks} = require('../controllers/taskController');

// Apply the authentication middleware
router.use(requireAuth);

router.post('/', createTask);
router.get('/', getTasks);

module.exports = router;