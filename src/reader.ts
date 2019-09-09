
import { EventHubClient, EventPosition } from '@azure/event-hubs';

const chalk = require('chalk');

export async function reader(argv: any, config: any): Promise<any> {
    const client = EventHubClient.createFromConnectionString(config.connection, config.hubname, { });
    const partitions = await client.getPartitionIds();
    for (const p of partitions) {
        const pCopy = p;
        client.receive(p,
            (event) => {
                print(pCopy, event);
            },
            (error) => {
                logerror(error);
            },
            {
                // epoch: 100,
                eventPosition: EventPosition.fromEnd(),
                consumerGroup : "$Default"
            });
    }
    return Promise.resolve(client);
}

function print(partitionId: string, event: any) {
    console.log(chalk.blue(`Partition: ${partitionId}`));
    console.log(chalk.blue(`event.body`));
    console.log(chalk.green(JSON.stringify(event.body, null, 2)));
    console.log(chalk.blue(`event.applicationProperties`));
    console.log(chalk.yellow(JSON.stringify(event.applicationProperties, null, 2)));
    console.log(chalk.blue(`event.properties`));
    console.log(chalk.yellow(JSON.stringify(event.properties, null, 2)));
    console.log(chalk.blue(`event.header`));
    console.log(chalk.yellow(JSON.stringify(event.header, null, 2)));
    console.log(chalk.blue(`event.annotations`));
    console.log(chalk.yellow(JSON.stringify(event.annotations, null, 2)));
    console.log(chalk.blue(`event.enqueuedTimeUtc`));
    console.log(chalk.bgGreen(event.enqueuedTimeUtc));
}

function logerror(error: Error) {
    console.log(error);
}