const cron = require('node-cron');
const Schedule = require('../model/cron_scheduler');

async function scheduleTask(identifier, expression, task) {
    await Schedule.deleteMany({});
    console.log("Scheduling task :::>");
    const existingSchedule = await Schedule.findOne({ identifier });
    let running;
    if (!existingSchedule) {
        console.log("Creating task :::>");
        cron.schedule(expression, () => {
            console.log("Running cron job from creation :::>")
            require(task)();
        });
        running = identifier;
        await Schedule.create({ identifier, expression, task });
    } else {
        console.log("Task already exist. Skipping:::>");
    }

    initializeScheduledTasks(running)
}

async function initializeScheduledTasks(running) {
    try {
        const schedules = await Schedule.find();
        console.log("Schedules > ", schedules)
        for (const schedule of schedules) {
            if (schedule.identifier !== running) {
                cron.schedule(schedule.expression, () => {
                    console.log("Running cron job from DB :::>")
                    require(schedule.task)();
                });
            }
        }
    } catch (error) {
        console.log("Error initialzing task > ", error)
    }
}

//Schedule lottery draw at 15:00 UTC+0 everyday
scheduleTask('lotteryDraw', '0 15 * * *', './lotteryDraw.js');
// scheduleTask('lotteryDraw', '*/60 * * * * *', './lotteryDraw.js');
