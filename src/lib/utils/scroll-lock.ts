/* eslint-disable no-param-reassign */
const lockedElements: Array<{ element: HTMLElement; initialOverflow: string }> =
  [];

export const disableScroll = (element: HTMLElement) => {
  if (element.style.overflow === "hidden") return;

  const initialOverflow = element.style.overflow;
  element.style.overflow = "hidden";

  lockedElements.push({ element, initialOverflow });
};

export const enableScroll = (element: HTMLElement) => {
  const index = lockedElements.findIndex((le) => le.element === element);
  if (index === -1) return;

  const { initialOverflow } = lockedElements[index];
  element.style.overflow = initialOverflow;

  lockedElements.splice(index, 1);
};
