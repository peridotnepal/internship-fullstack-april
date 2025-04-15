
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend: number;
}

export const MetricCard = ({ title, value, unit, trend }: MetricCardProps) => {
  const isPositive = trend >= 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {value.toFixed(2)}{unit}
          </div>
          <div className={`flex items-center space-x-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span className="text-sm font-medium">{Math.abs(trend).toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
