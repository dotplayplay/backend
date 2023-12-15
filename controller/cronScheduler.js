const scheduler = require('node-schedule');
const Schedule = require('../model/cron_scheduler');

async function scheduleTask(tasks) {
    try {
        const schedules = [];
        for (const { identifier, expression, module, task } of tasks) {
            const existingSchedule = await Schedule.findOne({ identifier });
            if (!existingSchedule) {
                console.log("Creating Scheduled task :::> ", identifier, new Date());
                schedules.push(Schedule.create([{ identifier, expression, module, task }]));
            }
        };
        await Promise.all(schedules);
        initializeScheduledTasks()
    } catch (error) {
        console.log("Error scheduling task> ", error)
    }
}

async function initializeScheduledTasks() {
    try {
        const schedules = await Schedule.find();
        for (const schedule of schedules) {
            const _d = JSON.parse(schedule.expression);
            const _rule = new scheduler.RecurrenceRule();
            _rule.second = !!_d.second && typeof _d.second !== 'number' ? new scheduler.Range(_d.second.start, _d.second.end, _d.second.step) : _d.second === undefined ? null : _d.second;
            _rule.minute = !!_d.minute && typeof _d.minute !== 'number' ? new scheduler.Range(_d.minute.start, _d.minute.end, _d.minute.step) : _d.minute === undefined ? null : _d.minute;
            _rule.hour = !!_d.hour && typeof _d.hour !== 'number' ? new scheduler.Range(_d.hour.start, _d.hour.end, _d.hour.step) : _d.hour === undefined ? null : _d.hour;
            _rule.tz = _d.tz === undefined ? null : _d.tz;
            scheduler.scheduleJob(_rule, async () => {
                console.log("Running scheduled task :::> ", schedule.identifier, new Date())
                if (schedule.task) {
                    await require(schedule.module)[schedule.task]();
                } else await require(schedule.task)();
            });
        }
    } catch (error) {
        console.log("Error initialzing task > ", error)
    }
}

scheduleTask([
    //Schedule lottery draw at 15:00 UTC+0 everyday
    {
        identifier: 'lotteryDrawTask', expression: JSON.stringify({
            tz: "UTC",
            second: 0,
            minute: 0,
            hour: 15,
        }), module: './lotteryController.js', task: 'runLotteryDraw'
    },
    //Schedule Setting Eth start block at 14:55 UTC+0 everyday
    {
        identifier: 'lotteryDrawSetEthBlock', expression: JSON.stringify({
            tz: "UTC",
            second: 0,
            minute: 55,
            hour: 14,
        }), module: './lotteryController.js', task: 'setDeadlineBlock'
    }
]);
/*
scheduleTask([
    {
        identifier: 'lotteryDrawTask', expression: JSON.stringify({
            tz: "UTC",
            second: 0,
            minute: {
                start: 8, end: 59, step: 8
            },
        }), module: './lotteryController.js', task: 'runLotteryDraw'
    },
    { identifier: 'lotteryDrawSetEthBlock', expression: JSON.stringify({
        tz: "UTC",
        second: 0,
        minute: {
            start: 3, end: 59, step: 3
        },
    }), module: './lotteryController.js', task: 'setDeadlineBlock' }
]);*/

process.on('SIGINT', function () {
    scheduler.gracefulShutdown().then(() => process.exit(0))
});