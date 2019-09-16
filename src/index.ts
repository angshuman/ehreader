#!/usr/bin/env node

import * as inq from 'inquirer';
import * as configstore from 'configstore';
import { reader } from './reader';

const store = new configstore('ehreader', {});
const connection = store.get('connection');

const questions = [
    {
        type: 'input',
        name: 'connection',
        default: connection,
        message: 'Event Hub Connection String'
    },
    {
        type: 'input',
        name: 'partitions',
        default: 'all',
        message: 'Partitions'
    },
    {
        type: 'input',
        name: 'consumerGroup',
        default: '$Default',
        message: 'Consumer Group'
    },
    {
        type: 'list',
        name: 'position',
        message: 'From position',
        choices: ['start', 'end', 'offset', 'sequence']
    },
    {
        type: 'input',
        name: 'offset',
        message: 'Offset Value',
        default: '-1',
        when: function (answers: any) {
            return answers.position === 'offset';
        }
    },
    {
        type: 'input',
        name: 'sequence',
        message: 'Sequence Value',
        default: '0',
        when: function (answers: any) {
            return answers.position === 'sequence';
        }
    }
];

async function run(): Promise<void> {
    const answers = await inq.prompt(questions);

    store.set('connection', answers.connection);

    await reader(answers);
}

run();



