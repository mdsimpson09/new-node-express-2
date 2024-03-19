require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Assuming you want to hash passwords before inserting
const hashPassword = async (password) => {
  const saltRounds = 10; // Or another number you deem secure
  return bcrypt.hash(password, saltRounds);
};

const pool = new Pool({
  test_database: process.env.DB_TEST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const seed = async () => {
  // User details including plaintext passwords (to be hashed below)
  const users = [
    { username: 'userone', firstName: 'User', lastName: 'One', email: 'userone@example.com', phone: '123-456-7890', password: 'password1', admin: false },
    { username: 'usertwo', firstName: 'User', lastName: 'Two', email: 'usertwo@example.com', phone: '098-765-4321', password: 'password2', admin: true },
    { username: 'userthree', firstName: 'User', lastName: 'Three', email: 'userthree@example.com', phone: '456-789-0123', password: 'password3', admin: false },
  ];

  try {
    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      await pool.query(
        'INSERT INTO users (username, first_name, last_name, email, phone, password, admin) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user.username, user.firstName, user.lastName, user.email, user.phone, hashedPassword, user.admin]
      );
    }
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
};

seed();