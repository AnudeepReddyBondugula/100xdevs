const express = require("express")
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

var userIDCounter = 0;
var users = [];


// * Middlewares
app.use(bodyParser.json());

// * ROUTE REQUESTS
// ** GET REQUESTS
app.get("/data", getAllUsersDataRequestHandler);


// ** POST REQUESTS
// *** Used for registering users
app.post("/signup", userSignUpRequestHandler);

// *** User Login
app.post("/login", userLoginRequestHandler);



// * Request Handlers
function userSignUpRequestHandler(req, res) {
  if (getUserByUsername(req.body.username)){
    res.status(400).send("400 Bad Request")
  }
  else{
    var userObj = {
      ID : userIDCounter,
      username : req.body.username,
      password : req.body.password,
      firstName : req.body.firstName,
      lastName : req.body.lastName
    }

    users.push(userObj);

    userIDCounter += 1;
    res.status(201).send("Signup successful");
  
  }
}

function userLoginRequestHandler(req, res){
  var userObj = getUserByUsername(req.body.username);
  if (userObj && userObj.password === req.body.password){
    res.send({
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      ID: userObj.ID
    })
  }
  else{
    res.status(401).send("Unauthorized!")
  }
}

function getAllUsersDataRequestHandler(req, res) {
  var userObj = getUserByUsername(req.headers.username);
  if (userObj && userObj.password === req.headers.password){
    var result = []
    for(var i = 0; i < users.length; i++){
      const userItem = {
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        ID: users[i].ID
      }
      result.push(userItem);
    }
    res.send(result);
  }
  else{
    res.status(401).send("Unauthorized!")
  }
}


// * Helper Functions

function getUserByUsername(username){
  for(var i = 0; i < users.length; i++){
    if (users[i].username === username) return users[i];
  }
  return null; // * User does not Exists!
}

app.listen(PORT, () => console.log("Listening on port: "+ PORT));
module.exports = app;
