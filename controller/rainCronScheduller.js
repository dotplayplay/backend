const schedule = require('node-schedule')
const colors = require('colors')

const date = () => {
    // Get today's date
    let today = new Date();

    let todayYear = today.getFullYear();
    let todayMonth = today.getMonth() + 1; // Adding 1 because months are zero-indexed
    let todayDay = today.getDate();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    const executedTime = todayYear + "-" + todayMonth + "-" + todayDay + ":" + hours + "-" + minutes + "-" + seconds;
    return executedTime
}
const task = () => {
    console.log(colors.green.underline("[Rain-Drop] Dripping Task Triggered Every Minutes for Testing ===>", date()).italic)
}
const rainScheduler = () => {
    console.log(colors.cyan.underline("Sending A [Rain-Drop] Every six(6) Hours ===>", date()).italic)
    schedule.scheduleJob('* * * * *', () => {
        task()
    })
}

rainScheduler()
process.on('SIGINT', () => {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})