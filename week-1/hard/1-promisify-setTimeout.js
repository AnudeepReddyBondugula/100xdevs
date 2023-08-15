


function wait(n){
    return new Promise((resolve)=>{
        setTimeout(()=>resolve("In SetTimeout"), n*1000); // ms -> sec

        // reject("Error in Promise Creation!");
    });
}

wait(2)
.then(result=>{
    console.log("Success: " + result);
})
.catch(err => {
    console.error(err);
})