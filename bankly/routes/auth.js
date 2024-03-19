/** Auth-related routes. */

const User = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const createTokenForUser = require('../helpers/createToken');
const { body, validationResult } = require('express-validator');

/** Register user; return token.
 *
 *  Accepts {username, first_name, last_name, email, phone, password}.
 *
 *  Returns {token: jwt-token-string}.
 *
 */

router.post('/register', async function(req, res, next) {
  try {
    // Destructure and validate incoming data
    const { username, password, first_name, last_name, email, phone } = req.body;
    
 // Register the user
      let user = await User.register({
        username,
        password,
        first_name,
        last_name,
        email,
        phone
});

// Create a token for the newly registered user
const token = createTokenForUser(username, user.admin);

// Return the token in a 201 Created response
return res.status(201).json({ token });
} catch (err) {
// If an error occurs, forward it to the error handling middleware
return next(err);
}
});


router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;
    // Ensure you await the result of the authenticate method
    let user = await User.authenticate(username, password);

    // Check if authentication was successful (user variable is truthy)
    if (!user) {
      // If authentication fails, return a 401 Unauthorized response
      return res.status(401).json({ error: "Invalid username/password" });
    }

    // Proceed to create a token for the authenticated user
    const token = createTokenForUser(username, user.admin);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}); // end

module.exports = router;


