
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MetricData } from "@/types/metrics";

interface MetricChartProps {
  data: MetricData[];
  companyData: MetricData[];
  title: string;
  unit: string;
}

export const MetricChart = ({ data, companyData, title, unit }: MetricChartProps) => {
  // Create a safe formatted data array that checks for missing data
  const formattedData = companyData.map((item, index) => {
    const sectorValue = index < data.length ? data[index].value : null;
    return {
      name: `${item.quarter} ${item.year}`,
      company: item.value,
      sector: sectorValue,
    };
  });

  return (
    <div className="w-full h-[300px] p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <XAxis dataKey="name" />
          <YAxis unit={unit} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)}${unit}`, ""]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="company"
            stroke="#8884d8"
            name="Company"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="sector"
            stroke="#82ca9d"
            name="Sector Average"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
