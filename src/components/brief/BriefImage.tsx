import { Box, Image } from "@chakra-ui/react";
import { Bus, Home } from "../ui/Animations";

const animationsMap: Record<string, JSX.Element> = {
  Bus: <Bus />,
  Home: <Home />,
};

export const BriefImage = ({
  image,
  animation,
}: {
  image: string;
  animation: string;
}) => {
  if (animation) {
    return (
      <Box
        flex="1"
        bg="neutrals.neutral100"
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {animationsMap[animation] || null}
      </Box>
    );
  }

  if (!image) {
    return null;
  }

  return (
    <Box flex="1" bg="neutrals.neutral100" p={4}>
      <Image
        src={`/brief/${image}`}
        alt={image}
        objectFit="contain"
        width="100%"
        height="100%"
      />
    </Box>
  );
};
