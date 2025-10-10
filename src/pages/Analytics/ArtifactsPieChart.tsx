"use client";

import { LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TotalArtifacts } from "@/services/analyticsService";

export const description = "A pie chart with a legend";

type ArtifactsPieProps = {
  data: TotalArtifacts[];
  label: string;
};

export function ArtifactsPie({ data, label }: ArtifactsPieProps) {
  // Aggregate totals
  const totals = data.reduce(
    (acc, curr) => ({
      left: curr.leftartifacts + acc.left,
      right: curr.rightartifacts + acc.right,
      both: curr.bothartifacts + acc.both,
    }),
    { left: 0, right: 0, both: 0 }
  );

  const chartData = [
    { key: "left", name: "Left", artifacts: totals.left, fill: "#ead1dc" },
    { key: "right", name: "Right", artifacts: totals.right, fill: "#b6d7a8" },
    { key: "both", name: "Both", artifacts: totals.both, fill: "#c9daf8" },
  ].filter((entry) => entry.artifacts > 0);

  const chartConfig = {
    artifacts: {
      label: "Artifact",
    },
    left: {
      label: "Left",
      color: "#ead1dc",
    },
    right: {
      label: "Right",
      color: "#b6d7a8",
    },
    both: {
      label: "Both",
      color: "#c9daf8",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-[#F9F4ED]">
      <CardHeader className="items-center pb-0">
        <CardTitle>{label}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 w-full pb-0 flex flex-col gap-2">
        {/* Chart takes most of the vertical space */}
        <div className="flex-1">
          {chartData.every((item) => item.artifacts === 0) ? (
            <div className="">No Forms Filled</div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="w-full [&_.recharts-text]:fill-background"
            >
              <ResponsiveContainer width="100%" height="">
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" hideLabel />}
                  />
                  <Pie data={chartData} dataKey="artifacts">
                    <LabelList
                      dataKey="artifacts"
                      position="inside"
                      stroke="none"
                      style={{ fill: "grey" }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>

        {/* Legend below */}
        <div className="space-y-1 px-2 ">
          {Object.entries(chartConfig)
            .filter(([key]) => key !== "artifacts")
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
                      (chartData.find((item) => item.key === key)?.artifacts ??
                        0)}
                  </span>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
