import React from "react";

const ContributionsGraph = () => {
  return (
    <div className="w-full bg-gray-900 text-white p-6 rounded-lg">
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-4">
          Learn how we count contributions
        </div>

        {/* Month labels */}
        <div className="flex mb-2">
          <div className="w-12"></div> {/* Space for day labels */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {weeks.map((_, weekIndex) => {
                // Show month label for first week of each month
                const firstDayOfWeek = weeks[weekIndex]?.[0]?.date;
                if (!firstDayOfWeek)
                  return <div key={weekIndex} className="w-3"></div>;

                const date = new Date(firstDayOfWeek);
                const isFirstWeekOfMonth = date.getDate() <= 7;
                const monthName = date.toLocaleDateString("en-US", {
                  month: "short",
                });

                return (
                  <div
                    key={weekIndex}
                    className="w-3 text-xs text-gray-400 text-center"
                  >
                    {isFirstWeekOfMonth ? monthName : ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="flex">
          {/* Day labels */}
          <div className="w-12 flex flex-col justify-between text-xs text-gray-400 pr-2">
            {days.map((day, index) => (
              <div key={index} className="h-3 flex items-center">
                {day}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex-1 overflow-x-auto">

            
            <div className="flex gap-1 min-w-max">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const day = week[dayIndex];
                    const today = new Date();
                    const startDate = new Date(today);
                    startDate.setDate(startDate.getDate() - 364);

                    const dayDate = day ? new Date(day.date) : null;
                    const isInRange =
                      dayDate && dayDate >= startDate && dayDate <= today;

                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm transition-all ${
                          day && isInRange
                            ? `cursor-pointer hover:ring-1 hover:ring-white/50 ${getColorClass(
                                day
                              )}`
                            : "bg-gray-900"
                        }`}
                        onMouseEnter={
                          day && isInRange
                            ? (e) => handleMouseEnter(day, e)
                            : undefined
                        }
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end mt-4 gap-2 text-xs text-gray-400">
          <span>loss</span>
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <div className="flex gap-1 ml-4">
            <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
          </div>
          <span>gain</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 30,
          }}
        >
          <div className="font-medium">
            {hoveredDay.count > 0
              ? `${hoveredDay.count} ${
                  hoveredDay.type === "gain" ? "contributions" : "losses"
                }`
              : "No contributions"}
          </div>
          <div className="text-gray-400">{formatDate(hoveredDay.date)}</div>
        </div>
      )}
    </div>
  );
};

export default ContributionsGraph;
