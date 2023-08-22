const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
var courseCounter = 1;

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  if (req.body.username == undefined || req.body.password == undefined){
    res.status(401).send("Username or Password not Specified!");
    return;
  }
  if (getAdmin(req.body.username)){
	res.status(401).send({
		message : "User aldredy Exists"
	})
  }
  var adminObj = {
    username : req.body.username,
    password : req.body.password
  }
  ADMINS.push(adminObj);
  res.send({
    message : "Admin created successfully"
  });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  if (req.headers.username == undefined || req.headers.password == undefined){
    res.status(401).send("Username or Password not Specified!");
    return;
  }
  for(var i = 0; i < ADMINS.length; i++){
    if (ADMINS[i].username == req.headers.username && ADMINS[i].password == req.headers.password){
      res.send({
        message : "Logged in successfully"
      });
      return
    }
  }

  res.status(401).send({
    message : "Unauthorized!"
  })

});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  if (req.headers.username == undefined || req.headers.password == undefined){
    res.status(401).send("Username or Password not Specified!");
    return;
  }
  for(var i = 0; i < ADMINS.length; i++){
    if (ADMINS[i].username == req.headers.username && ADMINS[i].password == req.headers.password){
		var courseObj = {
			courseid : courseCounter,
			title : req.body.title,
			description : req.body.description,
			price : req.body.price,
			imageLink : req.body.imageLink,
			published : true
		}
		COURSES.push(courseObj);
		courseCounter += 1;
      	res.send({
        	message : "Course created successfully",
			courseid : courseObj.courseid
      });
      return;
    }
  }
  res.status(401).send({
    message : "Unauthorized!"
  })


});

app.put('/admin/courses/:courseId', (req, res) => {
	if (req.headers.username == undefined || req.headers.password == undefined){
		res.status(401).send("Username or Password not Specified!");
		return;
	}
	for(var i = 0; i < ADMINS.length; i++){
		if (ADMINS[i].username == req.headers.username && ADMINS[i].password == req.headers.password){
			var courseObj = getCourseByID(req.params.courseId);
			if (courseObj == null){
				res.status(404).send({
					message : "Course NOT FOUND"
				})
			}
			else{
				courseObj.title = req.body.title;
				courseObj.description = req.body.description;
				courseObj.price = req.body.price;
				courseObj.imageLink = req.body.imageLink;
				courseObj.published = req.body.published;
				res.send({
					message : "Course updated successfully"
				})
			}
		  	return;
		}
	  }
	  res.status(401).send({
		message : "Unauthorized!"
	  })
	
	

});

app.get('/admin/courses', (req, res) => {
	if (req.headers.username == undefined || req.headers.password == undefined){
		res.status(401).send("Username or Password not Specified!");
		return;
	}
	for(var i = 0; i < ADMINS.length; i++){
		if (ADMINS[i].username == req.headers.username && ADMINS[i].password == req.headers.password){
			res.send(COURSES);
		  	return;
		}
	  }
	  res.status(401).send({
		message : "Unauthorized!"
	  })
	
});

// User routes
app.post('/users/signup', (req, res) => {
	if (req.body.username == undefined || req.body.password == undefined){
		res.status(401).send("Username or Password not Specified!");
		return;
	  }
	  if (getUser(req.body.username)){
		res.status(401).send({
			message : "User aldredy Exists"
		})
	  }
	  var userObj = {
		username : req.body.username,
		password : req.body.password,
		purchasedCourses : []
	  }
	  USERS.push(userObj);
	  res.send({
		message : "User created successfully"
	  });
});

app.post('/users/login', (req, res) => {
	if (req.headers.username == undefined || req.headers.password == undefined){
		res.status(401).send("Username or Password not Specified!");
		return;
	  }
	  for(var i = 0; i < USERS.length; i++){
		if (USERS[i].username == req.headers.username && USERS[i].password == req.headers.password){
		  res.send({
			message : "Logged in successfully"
		  });
		  return
		}
	  }
	
	  res.status(401).send({
		message : "Unauthorized!"
	  })
	
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  	if (req.headers.username == undefined || req.headers.password == undefined){
		res.status(401).send("Username or Password not Specified!");
		return;
	}
	for(var i = 0; i < USERS.length; i++){
		if (USERS[i].username == req.headers.username && USERS[i].password == req.headers.password){
			res.send(COURSES);
		  	return;
		}
  	}
  	res.status(401).send({
		message : "Unauthorized!"
  	})
});

app.post('/users/courses/:courseId', (req, res) => {
	if (req.headers.username == undefined || req.headers.password == undefined){
		res.status(401).send("Username or Password not Specified!");
		return;
	}
	for(var i = 0; i < USERS.length; i++){
		if (USERS[i].username == req.headers.username && USERS[i].password == req.headers.password){
			USERS[i].purchasedCourses.push(getCourseByID(req.params.courseId));
			res.send({
				message : "Course purchased successfully"
			})
		  	return;
		}
  	}
  	res.status(401).send({
		message : "Unauthorized!"
  	})
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  	if (req.headers.username == undefined || req.headers.password == undefined){
		res.status(401).send("Username or Password not Specified!");
		return;
	}
	for(var i = 0; i < USERS.length; i++){
		if (USERS[i].username == req.headers.username && USERS[i].password == req.headers.password){
			res.send(USERS[i].purchasedCourses);
		  	return;
		}
  	}
  	res.status(401).send({
		message : "Unauthorized!"
  	})
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});


// * HELPER FUNCTIONS

function getCourseByID(courseid){
	for(var i = 0; i < COURSES.length; i++){
		if (COURSES[i].courseid == courseid ) return COURSES[i];
	}
	return null;
}

function getAdmin(username){
	for(var i = 0; i < ADMINS.length; i++){
		if (ADMINS[i].username == username) return ADMINS[i];
	}
	return null;
}

function getUser(username){
	for(var i = 0; i < USERS.length; i++){
		if (USERS[i].username == username) return USERS[i];
	}
	return null;
}