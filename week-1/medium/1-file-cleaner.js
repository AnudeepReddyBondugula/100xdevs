const fs = require("fs");

fs.readFile("./1-inputFile.txt", 'utf-8', (err, data)=>{
    if (err){
        console.error(err);
        return;
    }
    
    const result = data.replace(/\s+/g, ' ').trim();

    console.log(result);

    fs.writeFile("1-outputFile.txt", result ,'utf-8', (err) =>{
        if (err){
            console.error(err);
        }
        else{
            console.log("Written Success!");
        }
    })

});