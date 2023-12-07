// ========================================= Initial loading run ------===========================================================
const HandleCountDown = ((e)=>{
    let timeSec = e
    let timeLoop = setInterval(() => {
    if (timeSec.toFixed(2) <= 0.1) {
        clearInterval(timeLoop);
        // handleMultiplier(detail)
    }else{
        timeSec -= 0.01;
        return timeSec
    }
    }, 10);
})
console.log(HandleCountDown(5))
// handleCountDown()

