/**
 * Converts a Date object or ISO string to an HTML date input compatible string (YYYY-MM-DD)
 */
export const toHtmlDate = (date: Date | string | undefined | null): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Gets the initials from a name
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
};
