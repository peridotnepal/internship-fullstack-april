"use client";

import React, { useMemo } from "react";
import { Card } from "../ui/card";

interface ContributionGraphProps {
  endDate: Date;
  data: {
    date: string;
    value: number;
  }[];
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
  endDate,
  data,
}) => {
  const startDate = useMemo(() => {
    const date = new Date(endDate);
    date.setMonth(date.getMonth() - 12); // Go back 12 months
    return date;
  }, [endDate]);

  const daysInWeek = ["Mon", "Wed", "Fri"];
  const months = [
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

  // Generate calendar data
  const calendarData = useMemo(() => {
    const calendar: any[][] = Array(7)
      .fill(null)
      .map(() => []);
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const weekIndex = (dayOfWeek + 6) % 7; // Adjust to make Monday first day (0)

      const dateStr = currentDate.toISOString().split("T")[0];
      const dayData = data.find((d) => d.date === dateStr);

      calendar[weekIndex].push({
        date: new Date(currentDate),
        value: dayData?.value || 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  }, [startDate, endDate, data]);

  const getColorForValue = (value: number) => {
    if (value === 0) return "bg-gray-800";
    if (value < 0) return "bg-red-500";
    return "bg-green-500";
  };

  return (
    <Card className="p-4 w-full">
      <div className="flex">
        <div className="flex flex-col pr-2 pt-6 text-xs text-gray-400">
          {daysInWeek.map((day, index) => (
            <div key={day} className="h-[30px] flex items-center">
              {day}
            </div>
          ))}
        </div>
        <div className="w-full overflow-x-auto">
          <div className="flex flex-col">
            <div className="flex justify-between text-xs text-gray-400 mb-1 px-1">
              {months.map((month) => (
                <div key={month}>{month}</div>
              ))}
            </div>
            <div className="flex gap-1">
              {calendarData[0].map((_, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-1">
                  {calendarData.map((row, rowIndex) => {
                    const cell = row[colIndex];
                    return cell ? (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-3 h-3 rounded-sm ${getColorForValue(
                          cell.value
                        )}`}
                        title={`${cell.date.toDateString()}: ${cell.value}`}
                      />
                    ) : (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-3 h-3"
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 mt-2 text-xs text-gray-400">
        <span>loss</span>
        <div className="w-3 h-3 rounded-sm bg-red-500"></div>
        <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
        <div className="w-3 h-3 rounded-sm bg-green-500"></div>
        <span>gain</span>
      </div>
    </Card>
  );
};

export default ContributionGraph;
