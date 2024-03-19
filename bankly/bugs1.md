BUG: In the DELETE /users/[username] route in routes/users.js, there's a missing await before calling User.delete
// TEST
it('should return 404 if cannot find user to delete', async function () {
  try {
    const response = await request(app)
      .delete(`/users/not-a-user`)
      .send({ _token: tokens.u3 });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: 'No such user' });
  } catch (err) {
    console.error(err);
  }
});

Fix: 
router.delete('/:username', authUser, requireAdmin, async function(
  req,
  res,
  next
) {
  try {
    const deleted = await User.delete(req.params.username);
    if (!deleted) {
      throw new ExpressError('No such user', 404);
    }
    return res.json({ message: 'deleted' });
  } catch (err) {
    return next(err);
  }
});

BUG: In the /auth/register route in routes/auth.js, there's a missing check for the uniqueness of the username before registering a new user.

// TESTS BUG #4
it('should not allow a user to register with an existing username', async function () {
  try {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "u1", // Existing username
        password: "new_password",
        first_name: "new_first",
        last_name: "new_last",
        email: "new@newuser.com",
        phone: "1233211221"
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: `There already exists a user with username 'u1'`
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/register', async function(req, res, next) {
  try {
    const { username, password, first_name, last_name, email, phone } = req.body;

    // Check if the username already exists in the database
    const userExists = await User.get(username);
    if (userExists) {
      throw new ExpressError(`There already exists a user with username '${username}'`, 400);
    }

    // Register the user
    let user = await User.register({username, password, first_name, last_name, email, phone});
    const token = createTokenForUser(username, user.admin);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

By adding this check, you ensure that the username is unique before allowing the registration of a new user.


*****************************
BUG: The /auth/login route is susceptible to timing attacks on password comparison.


// TESTS 
it('should allow a correct username/password to log in securely', async function () {
  try {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "pwd1"
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("u1");
    expect(admin).toBe(false);
  } catch (err) {
    console.error(err);
  }
});

// fix: By using bcrypt.compare, one can be sure that the password comparison is secure and not susceptible to timing attacks. Could use a constant-time comparison method for comparing passwords. Constant-time comparison ensures that the comparison always takes the same amount of time, regardless of whether the passwords match or not. This should help prevent timing attacks where an attacker can measure the time it takes for a comparison and deduce information about the password.


router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;

    // Retrieve user data by username
    const user = await User.authenticate(username, password);

    // Use bcrypt's constant-time comparison for password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      // Password is valid, generate and return a token
      const token = createTokenForUser(username, user.admin);
      return res.json({ token });
    } else {
      // Password is invalid, return a 401 Unauthorized response
      throw new ExpressError('Cannot authenticate', 401);
    }
  } catch (err) {
    return next(err);
  }
});




***************************
Bug: Admin users should only be able to view their own balance, and regular users should only be able to view their own balance.

// TEST
it('should deny access to admin users trying to view another user\'s balance', async function () {
  try {
    // Login as an admin user (u3)
    const adminResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "u3",
        password: "pwd3"
      });

    const adminToken = adminResponse.body.token;

    // Attempt to view the balance of another user (u1)
    const response = await request(app)
      .get("/users/u1")
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(401);
  } catch (err) {
    console.error(err);
  }
});


Fix: You could modify the /users/[username] route in routes/users.js to restrict access to viewing user balances based on user roles.

router.get('/:username', authUser, requireLogin, async function(
  req,
  res,
  next
) {
  try {
    let user = await User.get(req.params.username);

    // Check if the user is trying to access their own data or if they are an admin
    if (req.curr_username === user.username || req.curr_admin) {
      // User is authorized to view their own balance or they are an admin
      return res.json({ user });
    } else {
      // User is not authorized to view another user's balance
      throw new ExpressError('Unauthorized', 401);
    }
  } catch (err) {
    return next(err);
  }
});
With this modification, only the user themselves and admin users will be able to view the balance. Other users, including admin users, will receive a 401 Unauthorized response when trying to access another user's balance.




****************************
Hint on Last Bug

It’s in the middleware/auth.js file. Take a close look at the function authUser.

Bug: authUser middleware may not correctly set the user's data in the request object 

//test
// TESTS BUG #8
it('should correctly set user data in the request object when a valid token is provided', async function () {
  try {
    // Login as a user (u1)
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "pwd1"
      });

    const token = response.body.token;

    // Make a request that requires authentication
    const authenticatedResponse = await request(app)
      .get("/users/u1")
      .set('Authorization', `Bearer ${token}`);

    expect(authenticatedResponse.statusCode).toBe(200);
    expect(authenticatedResponse.body.user).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1"
    });
  } catch (err) {
    console.error(err);
  }
});

//fix modify authUser midware to set user data in reuqest object if a valid token is presented 
async function authUser(req, res, next) {
  const token = req.body._token || req.query._token;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.curr_username = payload.username;
    req.curr_admin = payload.admin;
    
    // Make sure to call next() to proceed with the request
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
}

module.exports = {
  requireLogin,
  requireAdmin,
  authUser
};
