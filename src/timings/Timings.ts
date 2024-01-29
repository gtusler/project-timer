import type { DbTiming } from "../db/DbController";


export type Timing = {
    id: number;
    event: 'start' | 'stop';
    project: string;
    date: Date;
};

export class Timings {
    public dbTimingsToTimings(input: DbTiming[]): Timing[] {
        let output: Timing[] = [];

        for (const i of input) {
            output.push({
                id: i.id,
                event: this.normalizeEventType(i.event),
                project: i.project,
                date: new Date(parseInt(i.time)),
            });
        }

        return output;
    }

    public normalizeEventType(input: string): 'start' | 'stop' {
        switch (input) {
            case 'start':
                return 'start';

            case 'stop':
                return 'stop'

            default:
                throw new Error('Invalid event type: ' + input);
        }
    }

    /**
     * @example
     * Input format is something like:
     *  [
     *      startEvent,
     *      stopEvent,
     *      startEvent,
     *      stopEvent,
     *  ]
     *
     * Output format is something like:
     *  [
     *      [ startEvent, stopEvent ],
     *      [ startEvent, stopEvent ],
     *  ]
     */
    public groupStartStopEvents(input: Timing[]): Timing[][] {
        let output: Timing[][] = [];

        let skipNext = false;
        let store: Timing[] = [];

        for (let i = 0; i < input.length; i++) {
            if (skipNext) {
                output.push(store);
                store = [];
                skipNext = false;
                continue;
            }

            if (input[i].event !== 'start') {
                console.log('data', input);
                throw new Error('invalid data structure');
            }

            store.push(input[i]);
            store.push(input[i + 1]);
            skipNext = true;
        }

        return output;
    }
}
