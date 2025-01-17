import { DateTime } from 'luxon';

export const formatDate = (dateString: string) => {
    const date = DateTime.fromISO(dateString).setZone('Asia/Kolkata');
    return date.toLocaleString(DateTime.DATE_MED); //Jun 16, 2001
    // return new Date(dateString).toISOString().split('T')[0]  //2001-06-16
};

export const formatPrice = (value: number, prefix: string): string => {
    return `${prefix}${new Intl.NumberFormat('en-IN').format(value)}`;
};