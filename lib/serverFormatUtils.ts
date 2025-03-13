/**
 * Server-side date formatting utilities that don't use browser APIs
 */

export const formatDateServer = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Simple formatting without luxon or other client libraries
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  } catch (e) {
    // Return a fallback if date is invalid
    return "Invalid date";
  }
}; 