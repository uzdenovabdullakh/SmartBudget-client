import Lottie from "lottie-react";
import moneyOnCard from "../../../public/animations/money-on-card.json";
import womanWithGraphics from "../../../public/animations/woman-and-graphics.json";
import notFound from "../../../public/animations/404.json";
import loading from "../../../public/animations/flying-money.json";
import errorAnimation from "../../../public/animations/error.json";
import bus from "../../../public/animations/bus.json";
import home from "../../../public/animations/home.json";

export const MoneyOnCard = () => (
  <Lottie
    autoplay
    loop
    animationData={moneyOnCard}
    style={{ maxWidth: "600px", maxHeight: "600px" }}
  />
);

export const WomanWithGraphics = () => (
  <Lottie
    autoplay
    loop
    animationData={womanWithGraphics}
    style={{ maxWidth: "600px", maxHeight: "600px" }}
  />
);

export const NotFound = () => (
  <Lottie
    animationData={notFound}
    loop
    style={{ maxHeight: 500, maxWidth: 500, width: "100%" }}
  />
);

export const ErrorAnimation = () => (
  <Lottie
    animationData={errorAnimation}
    loop
    style={{ maxHeight: 350, maxWidth: 350, width: "100%" }}
  />
);

export const Loading = () => (
  <Lottie
    animationData={loading}
    loop
    style={{ maxHeight: 500, maxWidth: 500, width: "100%" }}
  />
);

export const Bus = () => (
  <Lottie
    animationData={bus}
    loop
    style={{ maxHeight: 500, maxWidth: 500, width: "100%" }}
  />
);

export const Home = () => (
  <Lottie
    animationData={home}
    loop
    style={{ maxHeight: 500, maxWidth: 500, width: "100%" }}
  />
);
