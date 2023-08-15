let count = 0;

function print() {
    console.clear();
    console.log(count);
    count += 1;
}

setInterval(print, 1000);