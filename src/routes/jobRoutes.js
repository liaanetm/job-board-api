const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const { createJob } = require('../controllers/jobController');
const {getJobs, updateJob, deleteJob } = require('../controllers/jobController');


router.post('/create', auth, createJob);
router.get('/', auth, getJobs);           // View jobs (with optional filter)
router.put('/:id', auth, updateJob);      // Edit job
router.delete('/:id', auth, deleteJob);   // Delete job

module.exports = router;
