const pool = require('../config/db');

async function createProject(title, description, ownerId) {
  if (!title || !description || !ownerId) {
    throw new Error('Title, description, and ownerId are required');
  }

  try {
    const result = await pool.query(
      'INSERT INTO projects (title, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, ownerId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Could not create project');
  }
}

async function getProject(id) {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error retrieving project:', error);
    throw new Error('Could not retrieve project');
  }
}

module.exports = { createProject, getProject };
