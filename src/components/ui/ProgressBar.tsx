import { HStack, Box } from "@chakra-ui/react";

type ProgressBarProps = {
  spentAmount?: number;
  limitAmount?: number;
};

export const ProgressBar = ({
  spentAmount = 0,
  limitAmount = 1,
}: ProgressBarProps) => {
  const progress = Math.min((spentAmount * 100) / limitAmount, 100);

  const getProgressColor = (prs: number) => {
    if (prs <= 50) return "green";
    if (prs <= 80) return "orange";
    return "red";
  };

  const progressColor = getProgressColor(progress);

  const parts = 4;
  const partWidth = 100 / parts;

  return (
    <HStack spacing={1} width="100%">
      {Array.from({ length: parts }).map((_, index) => {
        const partStart = index * partWidth;
        const partEnd = (index + 1) * partWidth;
        const isFilled = progress >= partEnd;
        const isPartiallyFilled = progress > partStart && progress < partEnd;
        const partProgress = isPartiallyFilled
          ? ((progress - partStart) / partWidth) * 100
          : 100;

        const partKey = `part-${index}`;

        return (
          <Box
            key={partKey}
            flex={1}
            height="8px"
            borderRadius="md"
            backgroundColor={
              isFilled || isPartiallyFilled ? progressColor : "gray.100"
            }
          >
            {isPartiallyFilled && (
              <Box
                width={`${partProgress}%`}
                height="100%"
                backgroundColor={progressColor}
                borderRadius="md"
              />
            )}
          </Box>
        );
      })}
    </HStack>
  );
};
