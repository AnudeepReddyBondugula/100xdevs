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
    const promises = [waitOneSecond(), waitTwoSecond(), waitThreeSecond()]
    Promise.all(promises)
        .then((results)=>{
            console.log(results);
        })
        .catch(err => console.error(err));
}

calculateTime();