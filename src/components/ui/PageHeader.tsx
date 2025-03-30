import {
  Box,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import React from "react";
import { SkeletonUI } from "./SkeletonUI";

type PagesHeaderProps = {
  isLoading?: boolean;
  text?: string;
  subText?: string;
  buttons?: JSX.Element;
};

export const PageHeader = ({
  text,
  subText,
  isLoading,
  buttons,
}: PagesHeaderProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Десктопная версия
  if (!isMobile) {
    return (
      <Box p={6} textAlign="left" borderBottom="1px solid #e2e8f0">
        {isLoading ? (
          <Stack>
            <SkeletonUI height={4} />
            <SkeletonUI height={4} />
          </Stack>
        ) : (
          <>
            <HStack alignItems="center" justifyContent="space-between">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="granite.granite900"
                fontFamily="figtree"
              >
                {text}
              </Text>
              {buttons && buttons}
            </HStack>
            {subText && <Text>{subText}</Text>}
          </>
        )}
      </Box>
    );
  }

  // Мобильная версия
  return (
    <Box
      p={4}
      textAlign="center"
      borderBottom="1px solid #e2e8f0"
      position="relative"
    >
      {isLoading ? (
        <Stack>
          <SkeletonUI height={4} />
          <SkeletonUI height={4} />
        </Stack>
      ) : (
        <>
          <Flex alignItems="center" justifyContent="space-between" width="full">
            {/* Пустой бокс для балансировки */}
            <Box width="32px" visibility="hidden">
              <IconButton
                aria-label="empty"
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
              />
            </Box>

            <Box textAlign="center" flex={1} px={2}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="granite.granite900"
                fontFamily="figtree"
                noOfLines={1}
              >
                {text}
              </Text>
              {subText && (
                <Text fontSize="sm" mt={1} color="gray.500">
                  {subText}
                </Text>
              )}
            </Box>

            {buttons && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Actions"
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  size="sm"
                  width="32px"
                />
                <MenuList minW="150px">
                  {React.Children.map(buttons.props.children, (child) => {
                    if (!React.isValidElement(child)) return null;

                    // Для IconButton
                    if (child.type === IconButton) {
                      const iconButtonProps = child.props as {
                        icon: React.ReactElement;
                        onClick: () => void;
                        "aria-label": string;
                      };
                      return (
                        <MenuItem
                          icon={iconButtonProps.icon}
                          onClick={(e) => {
                            e.stopPropagation();
                            iconButtonProps.onClick();
                          }}
                          closeOnSelect={false}
                        >
                          {iconButtonProps["aria-label"]}
                        </MenuItem>
                      );
                    }

                    // Для модальных окон просто возвращаем null
                    return null;
                  })}
                </MenuList>
              </Menu>
            )}
          </Flex>

          {/* Рендерим модальные окна вне меню */}
          {buttons &&
            buttons.props.children.filter(
              (child: React.ReactNode) =>
                React.isValidElement(child) && child.props.isOpen !== undefined,
            )}
        </>
      )}
    </Box>
  );
};
