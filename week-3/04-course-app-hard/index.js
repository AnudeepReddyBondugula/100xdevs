const express   = require('express');
const mongoose  = require("mongoose");
const jwtoken   = require("jsonwebtoken");
const app       = express();

app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

const SECRET = "Secr3t";

const userSchema = new mongoose.Schema({
  username          : String,
  password          : String,
  purchasedCourses  : [{type : mongoose.Schema.Types.ObjectId, ref : "Course"}]
});

const adminSchema = new mongoose.Schema({
  username : String,
  password : String,
});

const courseSchema = new mongoose.Schema({
  title       : String,
  description : String,
  price       : Number,
  imageLink   : String,
  published   : Boolean
});

// * Define mongoose models
const User    = mongoose.model('User', userSchema);
const Admin   = mongoose.model("Admin", adminSchema);
const Course  = mongoose.model("Course", courseSchema);

// * Connecting to MongoDB
// ! add username and password or use env
mongoose.connect("mongodb+srv://<username>:<password>@cluster0.b02wbxn.mongodb.net/courses", {useNewUrlParser: true, useUnifiedTopology: true});

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username , password} = req.body;
  Admin.findOne({username})
  .then((admin) => {
    if (admin){   // Check admins username exists!
      res.status(403).json({
        message : "Admin aldredy exists"
      });
      return Promise.reject("Admin aldredy Exists!");
    }
    else{
      const newAdmin = new Admin({username, password});
      newAdmin.save();
      const token = jwtoken.sign({username, role : 'admin'}, SECRET, {expiresIn: '1h'});
      res.json({
        message : "Admin created successfully",
        token
      })
    }
  })
  .catch(err => console.log(err)); 
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username , password} = req.headers;
  Admin.findOne({username, password})
  .then((admin) => {
    if (admin){
      const token = jwt.sign({username, role : 'admin'}, SECRET, {expiresIn : '1h'});
      res.json({message : "Logged in successfully", token});
    }
    else{
      res.status(403).json({message : "Invalid username or password"});
      return Promise.reject("Invalid username or password!");
    }
  })
  .catch(err => console.log(err));
  
});

app.post('/admin/courses', authenticateJwtAdmin ,(req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  course.save()
  .then(()=> res.json({message : "Course created successfully", courseId : course.id}))
  .catch(err => console.log(err));
});

app.put('/admin/courses/:courseId', authenticateJwtAdmin, (req, res) => {
  // logic to edit a course
  Course.findByIdAndUpdate(req.params.courseId, req.body, {new : true})
  .then((course) => {
    if (course){
      res.json({message : "Course updated successfully"});
    }
    else{
      res.status(404).json({message : "Course not found"});
      return Promise.reject("Course not found");
    }
  })
  .catch(err => console.log(err));
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});


//* CUSTOM MIDDLEWARE

async function authenticateJwtAdmin(req, res, next){
  const {token} = req.headers;
  if (token){
    const user = await jwtoken.verify(token, SECRET);
    if (!user || !user.role == 'admin' || !(await Admin.findOne(username = user.username))){
      res.json({
        message : "Invalid user"
      })
    }
    else{
      next();
    }
  }
  else{
    res.json({message: "No token specified"});
  }
}