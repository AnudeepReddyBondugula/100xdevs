const fs = require("fs")

fs.writeFile("./test.txt", "This text is added using writeFile method", 'utf-8', (err)=>{
    if (err){
        console.error(err);
        return;
    }
    console.log("File has been written successfully!");
});