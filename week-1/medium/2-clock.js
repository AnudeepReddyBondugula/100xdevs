 function print() {
    date = new Date();
    const _12_hourTime = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
    
      const _24_hourTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      console.clear();
      console.log(_24_hourTime);
      console.log(_12_hourTime);
      setTimeout(print, 1000);
}

print();
  