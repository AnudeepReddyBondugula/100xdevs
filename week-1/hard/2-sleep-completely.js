function sleep(seconds){
    const ms = seconds * 1000

    const start = new Date();
    while(new Date() - start < ms){};
}

console.log("start");
sleep(2);
console.log("end");