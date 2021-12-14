require("dotenv").config();
require("./database/database").connect();
const express = require("express");
const auth = require("./middleware/auth");
const jwt = require("jsonwebtoken");

// importing user context
const User = require("./model/user");

const app = express();

app.use(express.json());

app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { user_id, organization_id, roll_id, user_full_name, user_email_id, user_roll_name, user_phone_num, user_password } = req.body;
  
      // Validate user input
      if (!(user_email_id && user_password)) {
        return res.status(400).send("All input is required!");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.user.findOne({ user_email_id });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      // Create user in our database
      const user = await User.user.create({
        user_id, 
        organization_id, 
        roll_id, 
        user_full_name, 
        user_email_id,
        user_roll_name, 
        user_phone_num, 
        user_password,
        createdat: Date(),
        updatedat: Date()
      });

    // Create token
    var date = Date();
    const token = jwt.sign(
      { user_email_id: user_email_id,user_full_name: user.user_full_name, last_login: date },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    // save user token
    const session = await User.session.create({
      user_email_id,
      token
    });
    console.log(token);
    session.user_email_id = user.user_email_id;
    session.token = token
  
      // return new user
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
});
    
// Login
app.post("/login", async (req, res) => {
    // Our login logic starts here
  try {
    // Get user input
    const { user_email_id, user_password } = req.body;
    console.log(req.body);
    // Validate user input
    if (!(user_email_id && user_password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user1 = await User.user.findOne({ user_email_id });
    // console.log(user1);

    if (user1 && (user_password === user1.user_password)) {
      // Create token
      var date = Date();
      const token = jwt.sign(
        { user_email_id: user_email_id,user_full_name: user1.user_full_name, last_login: date },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      console.log(token);
      // save user token
      const session = User.session.create({
        user_email_id,
        token
      });


      // user
      return res.status(200).json(user1);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.post("/welcome", auth, (req, res) => {
    return res.status(200).send("Welcome to home page.....");
});

module.exports = app;