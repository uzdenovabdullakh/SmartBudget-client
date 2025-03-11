/* eslint-disable no-param-reassign */
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
const supportsPassive = false;
const wheelOpt = supportsPassive ? { passive: false } : false;

interface ScrollLock {
  count: number;
  element: HTMLElement;
  handlers: {
    wheel: (e: Event) => void;
    touch: (e: Event) => void;
    key: (e: KeyboardEvent) => void;
  };
}

let globalLock: ScrollLock | null = null;

function preventDefault(this: HTMLElement, e: Event) {
  if (e.target instanceof Node && this.contains(e.target)) {
    e.preventDefault();
  }
}

function preventDefaultForScrollKeys(this: HTMLElement, e: KeyboardEvent) {
  if (keys[e.keyCode as keyof typeof keys] && this.contains(e.target as Node)) {
    e.preventDefault();
  }
}

export const disableScroll = (element: HTMLElement) => {
  if (globalLock) {
    globalLock.count += 1;
    return;
  }

  const wheelHandler = preventDefault.bind(element);
  const touchHandler = preventDefault.bind(element);
  const keyHandler = preventDefaultForScrollKeys.bind(element);

  element.style.touchAction = "none";

  element.addEventListener("wheel", wheelHandler, wheelOpt);
  element.addEventListener("touchmove", touchHandler, wheelOpt);
  element.addEventListener("keydown", keyHandler);

  globalLock = {
    count: 1,
    handlers: {
      wheel: wheelHandler,
      touch: touchHandler,
      key: keyHandler,
    },
    element,
  };
};

export const enableScroll = (element: HTMLElement) => {
  if (globalLock && globalLock.element === element) {
    globalLock.count -= 1;

    if (globalLock.count <= 0) {
      element.style.touchAction = "";
      element.removeEventListener("wheel", globalLock.handlers.wheel);
      element.removeEventListener("touchmove", globalLock.handlers.touch);
      element.removeEventListener("keydown", globalLock.handlers.key);
      globalLock = null;
    }
  }
};
