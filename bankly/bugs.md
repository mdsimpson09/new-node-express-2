

# GET request was still sending 200 status code without correct user info. Corrected code to send a 404 when no user is found and to send a 401 when a user is not authorized. the test was also changed to include the 404 not found status code.

/** GET /[username]
 *
 * Get details on a user. Only logged-in users should be able to use this.
 *
 * It should return:
 *     {user: {username, first_name, last_name, phone, email}}
 *
 * If user cannot be found, return a 404 err.
 *
 */

# old code 
router.get('/:username', authUser, requireLogin, async function(
  req,
  res,
  next
) {
  try {
    let user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});
# new code with 404 catch 
router.get('/:username', authUser, requireLogin, async function(req, res, next) {
  try {
    let user = await User.get(req.params.username);
    if (!user) {
      // If no user is found, return a 404 status code
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    return next(err); 
  }
});

# added to test to include 404 "not found"  
 test("should return 404 if the user cannot be found", async function() {
    const response = await request(app)
      .get("/users/nonExistingUser")
      .send({ _token: tokens.u1 }); // Assuming tokens.u1 is a valid token for an authenticated user
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: "User not found",
    });
  });
});


# Delete / users/[username] was testing for password hash before registration 
DELETE /users/[username] › should hash passwords before saving to the database

    data and hash arguments required

      233 |     const user = await User.get("new_user");
      234 |     expect(user.password).not.toEqual("password123");
    > 235 |     expect(await bcrypt.compare("password123", user.password)).toBe(tr

# removed console.log for auth/header in middelware that was causing failures 


 FAIL  __tests__/routes.test.js
  ✕ should hash passwords before saving to the database (81 ms)
  ✓ should allow a correct username/password to log in securely (10 ms)
  ✓ should return 404 if the user cannot be found (14 ms)
  POST /auth/register
    ✓ should allow a user to register in (118 ms)
    ✓ should not allow a user to register with an existing username (13 ms)
  POST /auth/login
    ✓ should allow a correct username/password to log in (10 ms)
  GET /users
    ✓ should deny access if no token provided (9 ms)
    ✓ should list all users (47 ms)
  GET /users/[username]
    ✓ should deny access if no token provided (9 ms)
    ✓ should return data on u1 (15 ms)
  PATCH /users/[username]
    ✓ should deny access if no token provided (9 ms)
    ✓ should deny access if not admin/right user (11 ms)
    ✓ should patch data if admin (13 ms)
    ✓ should disallowing patching not-allowed-fields (12 ms)
    ✓ should return 401 if cannot find (10 ms)
  DELETE /users/[username]
    ✓ should deny access if no token provided (8 ms)
    ✓ should deny access if not admin (10 ms)
    ✓ should allow if admin (11 ms)