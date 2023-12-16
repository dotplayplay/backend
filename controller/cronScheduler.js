const cron = require('node-cron');
const Schedule = require('../model/cron_scheduler');

async function scheduleTask(tasks) {
    // await Schedule.deleteMany({});
    const schedules = [];
    for (const { identifier, expression, module, task } of tasks) {
        const existingSchedule = await Schedule.findOne({ identifier });
        if (!existingSchedule) {
            console.log("Creating Scheduled task :::> ", identifier);
            schedules.push(Schedule.create([{ identifier, expression, module, task }]));
        } else {
            console.log("Task already exist. Skipping:::>");
        }
    };
    await Promise.all(schedules);
    initializeScheduledTasks()
}

async function initializeScheduledTasks() {
    try {
        const schedules = await Schedule.find();
        console.log("Schedules > ", schedules)
        for (const schedule of schedules) {
            cron.schedule(schedule.expression, () => {
                console.log("Running cron job from DB :::> ", schedule.identifier)
                if (schedule.task) {
                    require(schedule.module)[schedule.task]();
                } else require(schedule.task)();
            });
        }
    } catch (error) {
        console.log("Error initialzing task > ", error)
    }
}

//Schedule lottery draw at 15:00 UTC+0 everyday
scheduleTask([
    { identifier: 'lotteryDrawTask', expression: '0 15 * * *', module: './lotteryController.js', task: 'runLotteryDraw' },
    { identifier: 'lotteryDrawSetEthBlock', expression: '55 14 * * *', module: './lotteryController.js', task: 'setDeadlineBlock' }
]);
// scheduleTask([
//     { identifier: 'lotteryDrawTask', expression: '*/6 * * * *', module: './lotteryController.js', task: 'runLotteryDraw' },
//     { identifier: 'lotteryDrawSetEthBlock', expression: '* * * * *', module: './lotteryController.js', task: 'setDeadlineBlock' }
// ]);