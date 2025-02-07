import { Options } from "react-lottie";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

type LottieAnimationProps = {
  width?: number;
  height?: number;
} & Options;

const LottieAnimation = (props: LottieAnimationProps) => {
  const { animationData, width = 500, height = 500, loop = true } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof animationData === "string") {
      fetch(animationData)
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.log(error));
    }
  }, [animationData]);

  return (
    <Lottie
      options={{ animationData: data, loop, autoplay: true }}
      style={{ maxWidth: width, maxHeight: height }}
    />
  );
};

export const MoneyOnCard = () => (
  <LottieAnimation
    animationData="/animations/money-on-card.json"
    width={600}
    height={600}
  />
);
export const WomanWithGraphics = () => (
  <LottieAnimation
    animationData="/animations/woman-and-graphics.json"
    width={600}
    height={600}
  />
);
export const NotFound = () => (
  <LottieAnimation animationData="/animations/404.json" />
);
export const ErrorAnimation = () => (
  <LottieAnimation
    animationData="/animations/error.json"
    width={350}
    height={350}
  />
);
export const Loading = () => (
  <LottieAnimation animationData="/animations/flying-money.json" />
);
export const Bus = () => (
  <LottieAnimation animationData="/animations/bus.json" />
);
export const Home = () => (
  <LottieAnimation animationData="/animations/home.json" />
);
