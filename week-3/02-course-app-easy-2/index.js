const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//! SECRET KEYS (USE .ENV)
const adminSecretKey = "adminS3cr3t";
const userSecretKey = "us3rS3cr3t";



// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  if (!(req.body.username && req.body.password)){
    res.status(400).json({
      message: "username or password missing!"
    });
  }
  else if (userExistInBody(ADMINS, req)){
    res.status(400).json({
      message : "Admin aldready exists!"
    });
  }
  else{
    const adminObj = {
      username: req.body.username,
      password: req.body.password
    };
    ADMINS.push(adminObj);
    const jwtoken = jwt.sign(adminObj, adminSecretKey, {expiresIn : '1h'});

    res.status(201).json({ 
      message: 'Admin created successfully',
      token : jwtoken
    });
  }
});

app.post('/admin/login',(req, res) => {
  // logic to log in admin
  if (!(req.headers.username && req.headers.password)){
    res.status(400).json({
      message: "username or password missing!"
    });
    return;
  }
  const adminObj = userExistInHeaders(ADMINS, req);

  if (!adminObj){
    res.status(401).json({
      message : "Invalid username or password!"
    });
  }
  else{
    res.json({
      message: "Logged in successfully",
      token: jwt.sign(adminObj, adminSecretKey, {expiresIn : '1h'})
    });
  }

});

app.post('/admin/courses', verifyAdminToken, (req, res) => {
  // logic to create a course
  const courseObj = {
    courseId : Number(new Date()),
    title : req.body.title,
    description : req.body.description,
    price : req.body.price,
    imageLink : req.body.imageLink,
    published : req.body.published
  }

  COURSES.push(courseObj);
  res.status(201).json({
    message : "Courses created successfully",
    courseId : courseObj.courseId
  });
});

app.get('/admin/courses', verifyAdminToken, (req, res) => {
  // logic to get all courses
  res.json(COURSES);

});

app.put('/admin/courses/:courseId', verifyAdminToken, (req, res) => {
  // logic to edit a course
  const courseObj = getCourseById(COURSES, req.params.courseId);
  if (courseObj){
    courseObj.title = req.body.title;
    courseObj.description = req.body.description;
    courseObj.price = req.body.price;
    courseObj.imageLink =req.body.imageLink;
    courseObj.published = req.body.published;
    res.status(201).send({
      message: "Course updated successfully"
    })
  }
  else{
    res.status(404).send({
      message: "Course Not Found"
    })
  }

  // res.send("Hello")
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  if (!(req.body.username && req.body.password)){
    res.status(400).json({
      message: "username or password missing!"
    });
  }
  else if (userExistInBody(USERS, req)){
    res.status(400).json({
      message : "User aldready exists!"
    });
  }
  else{
    const userObj = {
      username: req.body.username,
      password: req.body.password,
      purchasedCourses : []
    };
    USERS.push(userObj);
    const jwtoken = jwt.sign(userObj, userSecretKey, {expiresIn : '1h'});

    res.status(201).json({ 
      message: 'User created successfully',
      token : jwtoken
    });
  }

});

app.post('/users/login', (req, res) => {
  // logic to log in user
  if (!(req.headers.username && req.headers.password)){
    res.status(400).json({
      message: "username or password missing!"
    });
    return;
  }
  const userObj = userExistInHeaders(USERS, req);

  if (!userObj){
    res.status(401).json({
      message : "Invalid username or password!"
    });
  }
  else{
    res.json({
      message: "Logged in successfully",
      token: jwt.sign(userObj, userSecretKey, {expiresIn : '1h'})
    });
  }
});

app.get('/users/courses', verifyUserToken, (req, res) => {
  // logic to list all courses
  res.json(COURSES);
});

app.post('/users/courses/:courseId', verifyUserToken, (req, res) => {
  // logic to purchase a course
  const courseObj = getCourseById(COURSES, req.params.courseId);
  if (courseObj){
    getUserByToken(req.headers.authorization)
    .then((user)=> {
      const userObj = USERS.find(item => item.username == user.username);
      if (getCourseById(userObj.purchasedCourses, req.params.courseId)){
        res.json({
          message : "Courses aldready purchased!"
        })
      }
      else{
        userObj.purchasedCourses.push(courseObj);
        console.log(USERS);
        console.log(userObj);
        res.json({
          message : "Course purchased successfully"
        })
      }
      return
    })
    .catch(err => res.status(500).send(err))
  }
  else{
    res.status(404).json({
      message : "Course Not Found"
    });
  }

});


app.get('/users/purchasedCourses', verifyUserToken, (req, res) => {
  // logic to view purchased courses
  getUserByToken(req.headers.authorization)
  .then(user => res.json(USERS.find(item => item.username == user.username).purchasedCourses))
  .catch(err => res.status(500).json({
    message : "Internal Server Error!"
  }))
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});


app.use((req, res, next)=>{
  res.send("Not valid page!");
  // next();
})

//* HELPER FUNCTIONS
function userExistInBody(userList, req){
	return userList.find(user => user.username == req.body.username && user.password == req.body.password);
}

function userExistInHeaders(userList, req){
  return userList.find(user => user.username == req.headers.username && user.password == req.headers.password);
}

function getCourseById(courseList, courseId){
  return courseList.find((course) => course.courseId == courseId);
}

function getUserByToken(jwToken){
  return new Promise((resolve, reject) => {
    jwt.verify(jwToken, userSecretKey, (err, decoded) => {
      if (err){
        reject(err);
      }
      else{
        resolve(decoded);
      }
    });
  });
}

//* HELPER MIDDLEWARES
function verifyAdminToken(req, res, next){
  const jwtoken = req.headers.authorization;
  if (jwtoken){
    jwt.verify(jwtoken, adminSecretKey, (err, decoded) => {
      if (err){
        res.status(401).send({
          message : "Invalid token or expired!"
        });
      }
      else if (ADMINS.find(admin => admin.username == decoded.username)){
        next();
      }
      else{
        res.status(401).json({
          message : "User does not exist"
        })
      }
    })
  }
  else{
    res.status(403).json({
      message:"No token provided"
    })
  }

}


function verifyUserToken(req, res, next){
  const jwtoken = req.headers.authorization;
  if (jwtoken){
    jwt.verify(jwtoken, userSecretKey, (err, decoded) => {
      if (err){
        res.status(401).json({
          message : "Invalid token or expired!"
        });
      }
      else{
        console.log(decoded.username);
        next();
      }
    })
  }
  else{
    res.status(403).json({
      message:"No token provided"
    })
  }

}
