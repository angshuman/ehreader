
import { EventHubClient, EventPosition } from '@azure/event-hubs';

const chalk = require('chalk');

export async function reader(config: any): Promise<any> {
    const client = EventHubClient.createFromConnectionString(config.connection);
    const partitions = await client.getPartitionIds();

    console.log(chalk.green(`connected. total partitions: ${partitions.length}`));

    let position: EventPosition;
    switch (config.position) {
        case 'start':
            position = EventPosition.fromStart();
            break;
        case 'end':
            position = EventPosition.fromEnd();
            break;
        case 'offset':
            position = EventPosition.fromOffset(config.offset);
            break;
        case 'sequence':
            position = EventPosition.fromSequenceNumber(config.sequence);
            break;
        default:
            console.error('Unknown position');
            return;
    }

    for (const p of partitions) {
        if (config.partitions !== 'all' && p !== config.partitions) {
            continue;
        }

        const pCopy = p;
        client.receive(p,
            (event) => {
                print(pCopy, event);
            },
            (error) => {
                logerror(error);
            },
            {
                eventPosition: position,
                consumerGroup: config.consumerGroup
            });
    }
    return Promise.resolve(client);
}

function print(partitionId: string, event: any) {
    console.log(chalk.bgBlue(`> Partition: ${partitionId}`));
    console.log(chalk.bgGreen(event.enqueuedTimeUtc));
    console.log(chalk.blue(`event.header`));
    console.log(chalk.yellow(JSON.stringify(event.header, null, 2)));
    console.log(chalk.blue(`event.applicationProperties`));
    console.log(chalk.yellow(JSON.stringify(event.applicationProperties, null, 2)));
    console.log(chalk.blue(`event.properties`));
    console.log(chalk.yellow(JSON.stringify(event.properties, null, 2)));
    console.log(chalk.blue(`event.annotations`));
    console.log(chalk.yellow(JSON.stringify(event.annotations, null, 2)));
    console.log(chalk.blue(`event.enqueuedTimeUtc`));
    console.log(chalk.blue(`event.body`));
    console.log(chalk.green(JSON.stringify(event.body, null, 2)));
    console.log();
}

function logerror(error: Error) {
    console.log(error);
}