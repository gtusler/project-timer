/** DD/MM/YYYY */
export function formatDatePretty(date: Date): string {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

/** HH:ii:SS */
export function formatTimePretty(date: Date): string {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/** DD/MM/YYYY HH:ii:SS */
export function formatDateTimePretty(date: Date): string {
    return formatDatePretty(date) + ' ' + formatTimePretty(date);
}

/**
 * Get the number of milliseconds since the 1st of Jan 1970
 */
export function formatDateTimeU(date: Date): number {
    return date.getTime();
}

export function dateFromU(u: number): Date {
    return new Date(u);
}

export function dateFromStringU(u: string): Date {
    return new Date(parseInt(u));
}

