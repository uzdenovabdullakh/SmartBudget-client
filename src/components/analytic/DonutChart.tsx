import { Box, Flex, Text } from "@chakra-ui/react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type DonutChartProps = {
  progress: number;
  limitAmount: number;
  spentAmount: number;
};

export const DonutChart = ({
  progress,
  limitAmount,
  spentAmount,
}: DonutChartProps) => {
  const getProgressColor = (pgr: number) => {
    if (pgr < 50) return "green";
    if (pgr < 80) return "orange";
    return "red";
  };

  const progressColor = getProgressColor(progress);

  const data = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        label: "Spent Amount",
        data: [
          Math.min(spentAmount, limitAmount),
          limitAmount - Math.min(spentAmount, limitAmount),
        ],
        backgroundColor: [progressColor, "lightgray"],
        borderColor: [progressColor, "lightgray"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <Flex justifyContent="center" alignItems="center" mb={4}>
      <Box pos="relative" w="60%">
        <Doughnut data={data} options={options} />
        <Box
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <Text fontSize="18px" fontWeight="bold">
            {`${progress.toFixed(0)}%`}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};
