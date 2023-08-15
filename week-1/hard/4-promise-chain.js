function waitOneSecond() {
    return new Promise((resolve)=>{
        setTimeout(()=> resolve("In WaitOneSecond Method!"), 1000);
    })
}

function waitTwoSecond() {
    return new Promise((resolve)=>{
        setTimeout(()=> resolve("In WaitTwoSecond Method!"), 2000);
    })
}

function waitThreeSecond() {
    return new Promise((resolve)=>{
        setTimeout(()=> resolve("In WaitThreeSecond Method!"), 3000);
    })
}

function calculateTime() {
    waitOneSecond()
    .then(result => {
        console.log(result);
        return waitTwoSecond();
    })
    .then(result => {
        console.log(result);
        return waitThreeSecond();
    })
    .then(result => {
        console.log(result);
    })
}

calculateTime();

