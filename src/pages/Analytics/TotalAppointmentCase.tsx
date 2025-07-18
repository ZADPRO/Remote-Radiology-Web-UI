import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AppointmentCases } from "@/services/analyticsService";

const chartConfig = {
  cases: {
    label: "",
    color: "#A4B2A1",
  },
} satisfies ChartConfig;

interface TotalAppointmentCaseProps {
  appointmentData: AppointmentCases[];
}

export function TotalAppointmentCase({
  appointmentData,
}: TotalAppointmentCaseProps) {
  const chartData = appointmentData.map((item) => ({
    month: item.month_name,
    cases: item.total_appointments,
  }));

  return (
    // Card should also be h-full to stretch
    <Card className="bg-[#F9F4ED] h-60 lg:h-100 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Previous months count</CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-full overflow-hidden">
        <ChartContainer
          config={chartConfig}
          className="w-full h-full overflow-hidden"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                domain={[0, "auto"]}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="cases"
                fill="var(--color-cases)"
                radius={8}
                barSize={30}
              >
                <LabelList
                  position="insideTop"
                  offset={12}
                  className="fill-background" // ensure visible on bar color
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
