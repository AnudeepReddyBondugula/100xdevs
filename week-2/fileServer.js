const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
fileNames = ['a.txt', 'b.txt', 'c.html'];

// * Request Routes
// ** GET Request Routes
// *** list of files in file directory
app.get("/files", listFilesRequestHandler);

// *** get Content of a file in files directory
app.get("/files/:fileName", getFileContentRequestHandler);


// * Request Handlers
// ** Returns lists the files in the files directory
function listFilesRequestHandler(req, res){
  res.send(fileNames);
}

// ** Returns the content of the file
function getFileContentRequestHandler(req, res){
  const filePath = "./files/" + req.params.fileName;
  fs.readFile(filePath, "utf-8", (err, data)=>{
    if (err){
      res.status(404).send("File not found");
    }
    else{
      res.send(data);
    }
  });
}


const port = 3000;
app.listen(port, () => {
  console.log("Listening on : " + port);
})
module.exports = app;
