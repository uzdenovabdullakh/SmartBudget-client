import { AnalyticResponseDto } from "@/lib/types/analytic.types";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { Context } from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

type PieChartProps = {
  data: AnalyticResponseDto;
  title: string;
  colors: string[];
};

export const PieChart = ({ data, title, colors }: PieChartProps) => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const chartData = {
    labels: data?.categories || [],
    datasets: [
      {
        label: t(title),
        data: data?.amounts || [],
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: isMobile ? 16 : 12,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        formatter: (value: number, context: Context) => {
          const total = context.chart.data.datasets[0].data
            .map((val) => (typeof val === "number" ? val : 0))
            .reduce((acc: number, curr: number) => acc + curr, 0);
          const percentage = `${((value / total) * 100).toFixed(1)}%`;
          return percentage;
        },
        color: "#000",
        font: {
          weight: "bold" as const,
          size: isMobile ? 16 : 12,
        },
        anchor: "end" as const,
        align: "end" as const,
        offset: 0,
        clip: false,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad" as const,
    },
    cutout: "75%",
    radius: isMobile ? "80%" : "70%",
  };

  return (
    <Box width={isMobile ? "100%" : "auto"}>
      <Text fontSize="xl" fontWeight="bold" align="center">
        {t(title)}
      </Text>
      <Box maxW="400px" p={4}>
        <Pie data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};
