export const dateToString = (date?: string) => {
  return date ? new Date(date).toLocaleString(undefined, { weekday: 'short', day: '2-digit', month: 'short', hour: 'numeric', minute: 'numeric' }) : 'Never';
};
