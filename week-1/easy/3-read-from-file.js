const fs = require("fs");

fs.readFile("./test.txt", 'utf-8', (err, data) => {
    if (err){
        console.log(err);
        return;
    }
    console.log(data);
    
    // Expensive Operation
    for(let i = 0; i < 10000000000; i++){};
    console.log("Completed!");
})