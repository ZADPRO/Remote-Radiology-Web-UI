// utils/date.ts
export const dateDisablers = {
  noFuture: (date: Date) => date > new Date(),
  noPast: (date: Date) => date < new Date(),
  onlyToday: (date: Date) => {
    const today = new Date();
    return (
      date.getDate() !== today.getDate() ||
      date.getMonth() !== today.getMonth() ||
      date.getFullYear() !== today.getFullYear()
    );
  },
};
