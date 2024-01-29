#!/usr/local/bin/bun

import chalk from 'chalk';
import prettyMilliseconds from 'pretty-ms';
import { DbController } from './db/DbController';
import { formatDateTimePretty } from './formatting/date';
import { Timings, type Timing } from './timings/Timings';



const helptext = `Simply store timings for projects
Usage:
    ${chalk.green('timer')} ${chalk.yellow('start')} projectName
    ${chalk.green('timer')} ${chalk.yellow('stop')} projectName
    ${chalk.green('timer')} ${chalk.yellow('abort')} projectName

    ${chalk.green('timer')} ${chalk.yellow('list')}
    ${chalk.green('timer')} ${chalk.yellow('count')} projectName

Pass -h or --help as the first arg to display this text.
`;


const validCommands = ['start', 'stop', 'abort', 'count', 'list'];
const command = Bun.argv[2];

if (command === undefined
    || command === '-h'
    || command === '--help'
    || validCommands.indexOf(command) < 0) {
    console.log(helptext);
    process.exit(0);
}

const dbPath = import.meta.dirname + '/../db/stuff.db';
const db = new DbController(dbPath);
db.open();

if (command === 'list') {
    listProjects();
    process.exit(0);
}


const projectName = Bun.argv[3];
if (projectName === undefined || projectName === '') {
    console.log(chalk.red('projectName must be a valid string'), '\n');
    console.log(helptext);
    process.exit(1);
}

const now = new Date();

if (! db.projectExists(projectName)) {
    if (command === 'start') {
        console.log('Adding a new project:', chalk.green(projectName));
        db.addProject(projectName);
    } else {
        console.log(`${chalk.red(`Timer ${projectName} doesn't exist.`)}
Run this to make a new timer:
    ${chalk.green('timer')} ${chalk.yellow('start')} ${projectName}
`);
        listProjects();
        process.exit(1);
    }
}

if (command === 'start') {
    if (db.timerIsRunning(projectName)) {
        console.log(`${chalk.red(`Timer ${projectName} is already running.`)}
Consider running one of the following commands to stop the timer:
    ${chalk.green('timer')} ${chalk.yellow('stop')} ${projectName}
    ${chalk.green('timer')} ${chalk.yellow('abort')} ${projectName}`);
        process.exit(1);
    }

    db.startTimer(projectName, now);
    process.exit(0);
}

if (command === 'stop' || command === 'abort') {
    if (! db.timerIsRunning(projectName)) {
        console.log(`${chalk.red(`There is no running timer for "${projectName}"`)}
Run this to start a timer:
    ${chalk.green('timer')} ${chalk.yellow('start')} ${projectName}`);
        process.exit(1);
    }

    switch (command) {
        case 'stop':
            db.stopTimer(projectName, now);
            break;

        case 'abort':
            db.stopRunning(projectName);
            db.removeLatestStartEvent(projectName);
            break;
    }
    process.exit(0);
}

if (command === 'count') {
    const t = new Timings();
    const timings: Timing[] = t.dbTimingsToTimings(db.getTimings(projectName));
    const grouped: Timing[][] = t.groupStartStopEvents(timings);

    console.log(chalk.green(projectName));

    let durations: number[] = []; // numbers of millis
    for (const [ start, stop ] of grouped) {
        const duration = stop.date.getTime() - start.date.getTime();
        durations.push(duration);

        console.log(chalk.green('start'), formatDateTimePretty(start.date));
        console.log(chalk.green('stop '), formatDateTimePretty(stop.date));
        console.log(chalk.yellow(prettyMilliseconds(duration)));
        console.log('');
    }

    const total = durations.reduce((a, c) => {
        return a + c;
    }, 0);

    console.log('Sessions:', grouped.length);
    console.log('Total:', chalk.yellow(prettyMilliseconds(total)));
}

function listProjects(): void {
    const allProjects = db.getProjects();
    console.log('There are', allProjects.length, 'projects:');
    for (const { name } of allProjects) {
        console.log(`    ${chalk.green(name)}`);
    }
}

