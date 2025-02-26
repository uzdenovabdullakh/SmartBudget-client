import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, BoxProps, Tr } from "@chakra-ui/react";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  nodeType: "table" | "box";
}

export const SortableItem = ({
  id,
  children,
  nodeType,
  ...rest
}: SortableItemProps & BoxProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (nodeType === "table") {
    return (
      <Tr
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        {...rest}
        height="65px"
      >
        {children}
      </Tr>
    );
  }

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </Box>
  );
};
