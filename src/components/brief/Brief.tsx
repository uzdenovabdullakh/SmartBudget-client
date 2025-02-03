import { useAnswerToBriefMutation } from "@/lib/services/brief.api";
import {
  Box,
  Text,
  Flex,
  Button,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  RadioGroup,
  Radio,
  Progress,
} from "@chakra-ui/react";
import { useState } from "react";
import { AnswerToBriefSchema } from "@/lib/validation/brief.schema";
import { BriefQuestions, QuestionCategoryMapping } from "@/lib/constants/brief";
import { useTranslation } from "react-i18next";
import { BriefImage } from "./BriefImage";

export const Brief = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();

  const questions = Object.keys(BriefQuestions);

  const [answerQuestion, { isLoading }] = useAnswerToBriefMutation();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>(
    Object.fromEntries(questions.map((q) => [q, []])),
  );

  const questionText = questions[currentQuestion];
  const { image, animation, categories } =
    QuestionCategoryMapping[
      questionText as keyof typeof QuestionCategoryMapping
    ];

  const isMultipleChoice = Array.isArray(BriefQuestions[questionText]);

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  const hasAnswered = answers[questionText].length > 0;

  const isOptionDisabled = (option: string) => {
    const lastOption = categories[categories.length - 1];
    const selectedAnswers = answers[questionText];
    return selectedAnswers.includes(lastOption) && option !== lastOption;
  };

  const handleSubmit = async () => {
    try {
      AnswerToBriefSchema.parse(answers);

      await answerQuestion(answers);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnswerChange = (value: string[]) => {
    const lastOption = categories[categories.length - 1];

    if (value.includes(lastOption)) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion]]: [lastOption],
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion]]: value.filter((val) => val !== lastOption),
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  return (
    <Flex
      position="fixed"
      height="100%"
      width="100%"
      bg="rgba(255, 255, 255, 0.5)"
      backdropFilter="blur(3px)"
      justify="center"
      align="center"
      zIndex={1000}
    >
      <Box
        bg="white"
        borderRadius="md"
        boxShadow="lg"
        maxW="1200px"
        height="500px"
        width="90%"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        position="relative"
      >
        <Progress
          value={progressPercentage}
          size="xs"
          color="blurple.blurple"
          borderTopRadius="md"
        />

        <Flex flex="1">
          <BriefImage image={image} animation={animation} />
          <Flex
            flex={image || animation ? "1.5" : "1"}
            p={8}
            justify="flex-start"
            align="center"
            flexDirection="column"
            width={image || animation ? "auto" : "100%"}
          >
            <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="center">
              {t(questionText)}
            </Text>
            {isMultipleChoice ? (
              <CheckboxGroup
                value={answers[questionText]}
                onChange={(value) => handleAnswerChange(value as string[])}
              >
                <SimpleGrid
                  columns={categories.length < 5 ? 1 : { base: 1, md: 2 }}
                  spacing={4}
                >
                  {categories.map((category) => (
                    <Checkbox
                      key={category}
                      value={category}
                      isDisabled={isOptionDisabled(category)}
                    >
                      {t(category)}
                    </Checkbox>
                  ))}
                </SimpleGrid>
              </CheckboxGroup>
            ) : (
              <RadioGroup
                value={answers[questionText][0] || ""}
                onChange={(value) => handleAnswerChange([value])}
              >
                <SimpleGrid
                  columns={categories.length < 5 ? 1 : { base: 1, md: 2 }}
                  spacing={4}
                >
                  {categories.map((category) => (
                    <Radio key={category} value={category}>
                      {t(category)}
                    </Radio>
                  ))}
                </SimpleGrid>
              </RadioGroup>
            )}

            <Flex position="absolute" bottom="16px" right="16px" gap="8px">
              <Button
                onClick={handleBack}
                isDisabled={currentQuestion === 0}
                variant="outline"
              >
                {t("Back")}
              </Button>
              <Button
                onClick={handleNext}
                isLoading={isLoading}
                isDisabled={!hasAnswered || isLoading}
                variant="primaryButton"
              >
                {currentQuestion === questions.length - 1
                  ? t("Submit")
                  : t("Continue")}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
