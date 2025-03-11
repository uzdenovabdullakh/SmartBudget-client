import { useEffect } from "react";
import { disableScroll, enableScroll } from "../utils/scroll-lock";

export const useScrollControl = (isOpen: boolean) => {
  useEffect(() => {
    const element = document.getElementById("budget-categories");
    if (!element) return;

    if (isOpen) {
      disableScroll(element);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      if (isOpen) {
        enableScroll(element);
      }
    };
  }, [isOpen]);
};
