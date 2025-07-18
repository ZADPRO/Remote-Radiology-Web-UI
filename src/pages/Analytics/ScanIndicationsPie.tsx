"use client";

import { LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IntakeFormAnalytics } from "@/services/analyticsService";

export const description = "A pie chart with a legend";

type ScanIndicationsPieProps = {
  data: IntakeFormAnalytics[];
};

export function ScanIndicationsPie({ data }: ScanIndicationsPieProps) {
  // Aggregate totals
  const totals = data.reduce(
    (acc, curr) => ({
      SForm: acc.SForm + curr.SForm,
      DaForm: acc.DaForm + curr.DaForm,
      DbForm: acc.DbForm + curr.DbForm,
      DcForm: acc.DcForm + curr.DcForm,
    }),
    { SForm: 0, DaForm: 0, DbForm: 0, DcForm: 0 }
  );

  const chartData = [
    { name: "s", visitors: totals.SForm, fill: "#741b47" },
    { name: "da", visitors: totals.DaForm, fill: "#38761d" },
    { name: "db", visitors: totals.DbForm, fill: "#1155cc" },
    { name: "dc", visitors: totals.DcForm, fill: "#bf9000" },
  ].filter((entry) => entry.visitors > 0);

  const chartConfig = {
    visitors: {
      label: "Forms",
    },
    s: {
      label: "S- Routine Breast Screening",
      color: "#741b47",
    },
    da: {
      label: "Da-Diagnostic - Abnormal Symptom",
      color: "#38761d",
    },
    db: {
      label: "Db-Diagnostic - Biopsy Confirmed DCIS",
      color: "#1155cc",
    },
    dc: {
      label: "Dc-Diagnostic - Comparison to a Prior QT Scan",
      color: "#bf9000",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-[#F9F4ED]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Scan Indications</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 w-full pb-0 flex flex-col gap-2">
        {/* Chart takes most of the vertical space */}
        <div className="flex-1">
          {chartData.every((item) => item.visitors === 0) ? (
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
                  <Pie data={chartData} dataKey="visitors">
                    <LabelList dataKey="visitors" position="inside" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>

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
                      (chartData.find((item) => item.name === key)?.visitors ??
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
