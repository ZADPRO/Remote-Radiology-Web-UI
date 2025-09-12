"use client";

import { LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RecommentdationPieModel } from "@/services/analyticsService";

export const description = "A pie chart with a legend";

type ScanIndicationsPieProps = {
  data: RecommentdationPieModel;
  Side: string;
};

export function RecoCodeCountPie({ data, Side }: ScanIndicationsPieProps) {
  const dataArray = Array.isArray(data) ? data : [data];

  // Aggregate totals
  const totals = dataArray.reduce(
    (acc, curr) => ({
      Annualscreening: acc.Annualscreening + curr.Annualscreening,
      Biopsy: acc.Biopsy + curr.Biopsy,
      Breastradiologist: acc.Breastradiologist + curr.Breastradiologist,
      ClinicalCorrelation: acc.ClinicalCorrelation + curr.ClinicalCorrelation,
      OncoConsult: acc.OncoConsult + curr.OncoConsult,
      Redo: acc.Redo + curr.Redo,
      USGSFU: acc.USGSFU + curr.USGSFU,
    }),
    {
      Annualscreening: 0,
      Biopsy: 0,
      Breastradiologist: 0,
      ClinicalCorrelation: 0,
      OncoConsult: 0,
      Redo: 0,
      USGSFU: 0,
    }
  );

  console.log(totals);

  const chartData = [
    {
      name: "Annual Screening",
      visitors: totals.Annualscreening,
      fill: "#b6d7a8",
    },
    { name: "USG/SFU", visitors: totals.USGSFU, fill: "#ffe599" },
    { name: "Biopsy", visitors: totals.Biopsy, fill: "#e6b8af" },
    {
      name: "Breast Radiologist",
      visitors: totals.Breastradiologist,
      fill: "#f4cccc",
    },
    {
      name: "Clinical Correlation",
      visitors: totals.ClinicalCorrelation,
      fill: "#c9daf8",
    },
    { name: "Onco Consult", visitors: totals.OncoConsult, fill: "#d9d2e9" },
    { name: "Redo", visitors: totals.Redo, fill: "#cccccc" },
  ].filter((entry) => entry.visitors > 0);

  const chartConfig = {
    visitors: {
      label: "Reco Code",
    },
    Annualscreening: {
      label: "Annual Screening",
      color: "#b6d7a8",
    },
    USGSFU: {
      label: "USG/SFU",
      color: "#ffe599",
    },
    Biopsy: {
      label: "Biopsy",
      color: "#e6b8af",
    },
    Breastradiologist: {
      label: "Breast Radiologist",
      color: "#f4cccc",
    },
    ClinicalCorrelation: {
      label: "Clinical Correlation",
      color: "#c9daf8",
    },
    OncoConsult: {
      label: "Onco Consult",
      color: "#d9d2e9",
    },
    Redo: {
      label: "Redo",
      color: "#cccccc",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-[#F9F4ED]">
      <CardHeader className="items-center pb-0">
        <CardTitle>{Side} Reco Code</CardTitle>
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
                    <LabelList
                      dataKey="visitors"
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
        <div className="space-y-1 px-2">
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
                    {config.label} -{" "}
                    {chartData.find((item) => item.name === config.label)
                      ?.visitors ?? 0}
                  </span>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
