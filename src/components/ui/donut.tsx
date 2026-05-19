"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  value: number; // percentage (0–100)
  size?: number; // optional control
  strokeWidth?: number;
  colors?: [string, string]; // [filled, remaining]
  centerText?: React.ReactNode;
}

export function DonutChart({
  value,
  size = 120,
  strokeWidth = 12,
  colors = ["#2563eb", "#e5e7eb"],
  centerText,
}: DonutChartProps) {
  const data = [
    { name: "filled", value },
    { name: "remaining", value: 100 - value },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[{ value: 100 }]}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            stroke="none"
            isAnimationActive={false}
          >
            <Cell fill={colors[1]} />
          </Pie>

          <Pie
            data={[{ value: value }]}
            dataKey="value"
            startAngle={90}
            endAngle={90 - (value / 100) * 360}
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            cornerRadius={strokeWidth / 2}
            stroke="none"
          >
            <Cell fill={colors[0]} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center">
        {centerText || <span className="text-sm font-semibold">{value}%</span>}
      </div>
    </div>
  );
}
