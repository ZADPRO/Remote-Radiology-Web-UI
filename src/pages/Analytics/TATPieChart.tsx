"use client";

import { PieChart, Pie, LabelList } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TATStats } from "@/services/analyticsService";

interface TATPieChartProps {
  data: TATStats[];
}

export function TATPieChart({ data }: TATPieChartProps) {
  const stat = data[0] ?? {
    gt_10_days: 0,
    le_1_day: 0,
    le_3_days: 0,
    le_7_days: 0,
    le_10_days: 0,
  };

  const total =
    stat.gt_10_days +
    stat.le_1_day +
    stat.le_3_days +
    stat.le_7_days +
    stat.le_10_days;

  const chartData = [
    { label: ">10 Days", value: stat.gt_10_days, fill: "#dd7e6b" },
    { label: "≤1 Day", value: stat.le_1_day, fill: "#b6d7a8" },
    { label: "≤3 Days", value: stat.le_3_days, fill: "#a2c4c9" },
    { label: "≤7 Days", value: stat.le_7_days, fill: "#ffe599" },
    { label: "≤10 Days", value: stat.le_10_days, fill: "#f9cb9c" },
  ]
    .filter((item) => item.value > 0)
    .map((item) => ({
      ...item,
      percentageLabel: `${Math.round((item.value / total) * 100)}%`,
    }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.label] = {
      label: item.label,
      color: item.fill,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const CustomLegend = ({ data }: { data: typeof chartData }) => (
    <div className="flex flex-col gap-2 mt-4">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: item.fill }}
          />
          <span className="text-sm">
            {item.label} ({item.value})
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="flex flex-col bg-[#F9F4ED]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Turnaround Time (TAT)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-gray-500">
            No TAT Data
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-text]:fill-background mx-auto aspect-square h-auto max-h-68"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
              <Pie data={chartData} dataKey="value" nameKey="label">
                <LabelList
                  dataKey="percentageLabel"
                  position="inside"
                  className="fill-background"
                />
                <CustomLegend data={chartData} />
              </Pie>
              {/* <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ marginTop: 12 }}
              /> */}
            </PieChart>
          </ChartContainer>
        )}
        {/* Legend below */}
        <div className="space-y-1 px-2 ">
          {Object.entries(chartConfig)
            .filter(([key]) => key !== "visitors")
            .map(([key, config]) => {
              if (!("color" in config)) return null;
              return (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-sm"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs">
                    {config.label +
                      " - " +
                      chartData.find((item) => item.label === key)?.value}
                  </span>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
