import { DateTime } from 'luxon';

export const formatDate = (dateString: string) => {
    const date = DateTime.fromISO(dateString).setZone('Asia/Kolkata'); // Set your desired timezone
    return date.toLocaleString(DateTime.DATE_MED); // Format the date
};
