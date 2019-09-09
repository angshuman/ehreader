#!/usr/bin/env node

import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';

import { reader } from './reader';

const chalk = require('chalk');

const argv = yargs
    .usage('Usage: $0 [options]')
    .default('partition', 'all')
    .alias('p', 'partition')
    .default('days', 0)
    .alias('d', 'days')
    .default('hours', 0)
    .alias('h', 'hours')
    .default('minutes', 0)
    .alias('m', 'minutes')
    .default('seconds', 0)
    .alias('s', 'seconds')
    .default('otuput', '')
    .alias('c', 'config')
    .demandOption('config')
    .argv;

const filePath = path.join(process.cwd(), argv.config as string);

if (!fs.existsSync(filePath)) {
    console.log(chalk.yellow('Config file not found. Creatig empty'));
    const emptyConfig = {
        connection: '',
        hubname: ''
    };
    fs.writeFileSync(filePath, JSON.stringify(emptyConfig, null, 2));
    process.exit(1);
}
const configFile = fs.readFileSync(filePath, 'utf-8');
const config = JSON.parse(configFile);

run(argv, config).then(()=> {
    console.log(chalk.green('Done.'));
});

async function run(argv : any, config: any) {
    if (config.connection) {
        await reader(argv, config);
    } else {
        console.log(chalk.red('Invalid configuration'));
        process.exit(1);
    }
}



