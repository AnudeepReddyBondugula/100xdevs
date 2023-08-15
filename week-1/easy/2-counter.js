let count = 0;

function print() {
    console.clear();
    console.log(count);
    count += 1;
    setTimeout(()=>print(), 1000);
}

print();

