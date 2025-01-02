export const ErrorCodes = {
  USER_DELETED: "USER_DELETED",
  USER_NOT_ACTIVATED: "USER_NOT_ACTIVATED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
};

export const BriefQuestions: Record<string, string[] | string> = {
  "Tell us about your home": "",
  "Do you currently have any debt?": [],
  "How do you get around?": [],
  "Which of these do you regularly spend money on?": [],
  "Which of these subscriptions do you have?": [],
  "What are some expenses that always sneak up on you?": [],
  "Are you saving, or planning to, for any of these?": [],
  "What else do you want to include - without stress or guilt?": [],
} as const;

export const QuestionCategoryMapping = {
  "Tell us about your home": {
    image: "",
    animation: "Home",
    categories: ["I rent", "I own", "Other"],
  },
  "Do you currently have any debt?": {
    image: "credit-card-cancel.svg",
    animation: "",
    categories: [
      "Credit Card",
      "Student Loans",
      "Auto Loans",
      "Personal Loans",
      "Medical Debt",
      "I don't currently have debt",
    ],
  },
  "How do you get around?": {
    image: "",
    animation: "Bus",
    categories: [
      "Car",
      "Bike",
      "Public transit",
      "Walk",
      "Rideshare (Uber/Lyft/etc.)",
      "Wheelchair",
      "Motorcycle",
      "None of these apply to me",
    ],
  },
  "Which of these do you regularly spend money on?": {
    image: "money.svg",
    animation: "",
    categories: [
      "Groceries",
      "Phone",
      "Internet",
      "Personal Care",
      "Clothing",
      "None of these apply to me",
    ],
  },
  "Which of these subscriptions do you have?": {
    image: "study-university.svg",
    animation: "",
    categories: [
      "Music",
      "Audio or ebooks",
      "TV streaming",
      "News",
      "Fitness",
      "Meal delivery",
      "Online courses",
      "I don't subscribe to any of these",
    ],
  },
  "What are some expenses that always sneak up on you?": {
    image: "",
    animation: "",
    categories: [
      "Annual credit card fees",
      "Medical expenses",
      "Taxes or other fees",
      "None of these apply to me",
    ],
  },
  "Are you saving, or planning to, for any of these?": {
    image: "bank.svg",
    animation: "",
    categories: [
      "Emergency fund",
      "New car",
      "Retirement",
      "Vacation",
      "Investments",
      "Baby",
      "New home",
      "Wedding",
      "I don't save for any of these",
    ],
  },
  "What else do you want to include - without stress or guilt?": {
    image: "flash.svg",
    animation: "",
    categories: [
      "Dining out",
      "Charity",
      "Entertainment",
      "Gifts",
      "Video games",
      "Home decor",
      "Hobbies",
      "Celebrations",
      "None of these apply to me",
    ],
  },
};
