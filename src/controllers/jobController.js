const pool = require('../db'); // adjust path if needed

// Create a job post
const createJob = async (req, res) => {
  const { title, company, location, description } = req.body;
  const userId = req.user.userId; // user info attached by your auth middleware


  if (!title || !company) {
    return res.status(400).json({ msg: 'Title and company are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO jobs (title, company, location, description, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, company, location, description, userId]
    );

    res.status(201).json({ msg: 'Job posted successfully', job: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
// Get all jobs for the logged-in user
const getJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Decoded userId: ", userId); // DEBUGGING

    const {type} = req.query;
    let query = `SELECT * FROM jobs WHERE user_id = $1`;
    let params = [userId];
    if(type){
      query += ' AND job_type = $2';
      params.push(type);
    }
    query +=' ORDER BY posted_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, company, location, description } = req.body;
  const userId = req.user.userId;

  try {
    // Check ownership
    const job = await pool.query(`SELECT * FROM jobs WHERE id = $1 AND user_id = $2`, [id, userId]);
    if (job.rows.length === 0) {
      return res.status(403).json({ msg: 'Not authorized to update this job' });
    }

    // Update job
    const result = await pool.query(
      `UPDATE jobs
       SET title = $1, company = $2, location = $3, description = $4
       WHERE id = $5
       RETURNING *`,
      [title, company, location, description, id]
    );

    res.json({ msg: 'Job updated successfully', job: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Check ownership
    const job = await pool.query(`SELECT * FROM jobs WHERE id = $1 AND user_id = $2`, [id, userId]);
    if (job.rows.length === 0) {
      return res.status(403).json({ msg: 'Not authorized to delete this job' });
    }

    await pool.query(`DELETE FROM jobs WHERE id = $1`, [id]);
    res.json({ msg: 'Job deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};
