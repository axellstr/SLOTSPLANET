import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

interface StrictModeDroppableProps extends DroppableProps {
  children: any;
}

export const StrictModeDroppable = ({ 
  children, 
  droppableId,
  type = "DEFAULT",
  mode = "standard",
  isDropDisabled = false,
  isCombineEnabled = false,
  direction = "vertical",
  ignoreContainerClipping = false,
  renderClone,
  getContainerForClone
}: StrictModeDroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable 
      droppableId={droppableId}
      type={type}
      mode={mode}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      direction={direction}
      ignoreContainerClipping={ignoreContainerClipping}
      renderClone={renderClone}
      getContainerForClone={getContainerForClone}
    >
      {children}
    </Droppable>
  );
}; 