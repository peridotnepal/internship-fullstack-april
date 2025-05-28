export function getStartDate(endDate: Date): Date {
  const startDate = new Date(endDate);
  startDate.setFullYear(endDate.getFullYear() - 1);
  startDate.setDate(startDate.getDate() + 1);
  return startDate;
}

export function getDaysBetweenDates(startDate: Date, endDate: Date): number {
  return Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export function generateEmptyContributionData(
  startDate: Date,
  endDate: Date
): ContributionDay[] {
  const days = getDaysBetweenDates(startDate, endDate);
  const contributionData: ContributionDay[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    contributionData.push({
      date: date.toISOString().split("T")[0],
      count: 0,
      level: 0,
    });
  }

  return contributionData;
}

export interface MonthLabel {
  text: string;
  colSpan: number;
}

export function getMonthLabels(startDate: Date, endDate: Date): MonthLabel[] {
  const monthLabels: MonthLabel[] = [];
  let currentDate = new Date(startDate);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Adjust to start from Monday
  const day = currentDate.getDay();
  if (day !== 1) {
    // If not Monday
    const diff = day === 0 ? -6 : 1 - day; // Sunday = 0, so handle specially
    currentDate.setDate(currentDate.getDate() + diff);
  }

  while (currentDate <= endDate) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    let weekCount = 0;
    const monthStart = new Date(currentDate);

    // Count weeks in this month
    while (
      currentDate <= endDate &&
      currentDate.getMonth() === month &&
      currentDate.getFullYear() === year
    ) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 1 || weekCount === 0) {
        // Monday or first week
        weekCount++;
      }
      currentDate.setDate(currentDate.getDate() + 7); // Jump by weeks
    }

    if (weekCount > 0) {
      monthLabels.push({
        text: monthNames[month],
        colSpan: weekCount,
      });
    }
  }

  return monthLabels;
}

export function getWeeksInYear(startDate: Date, endDate: Date): Date[][] {
  const weeks: Date[][] = [];
  let currentDate = new Date(startDate);

  // Adjust to start from Monday
  const day = currentDate.getDay();
  if (day !== 1) {
    // If not Monday
    const diff = day === 0 ? -6 : 1 - day; // Sunday = 0, so handle specially
    currentDate.setDate(currentDate.getDate() + diff);
  }

  while (currentDate <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      // Create a new Date object for each day to avoid reference issues
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export function getDayLabel(dayIndex: number): string {
  const days = ["Mon", "Wed", "Fri"];
  return days[dayIndex] || "";
}
