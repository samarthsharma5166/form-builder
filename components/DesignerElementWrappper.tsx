import { useDraggable, useDroppable } from "@dnd-kit/core";
import { FormElement, FormElementInstance } from "./FormElement"
import { useState } from "react";
import { Button } from "./ui/button";
import { BiSolidTrash } from "react-icons/bi";
import useDesigner from "./hooks/useDesigner";
import { cn } from "@/lib/utils";

const DesignerElementWrappper = ({ element }: { element: FormElementInstance }) => {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner()!;
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true
    }
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true
    }
  });
  const DesignerElement = FormElement[element.type].designerComponent;

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true
    }
  });

  if (draggable.isDragging) return null;
  return (<div
    ref={draggable.setNodeRef}
    {...draggable.listeners}
    {...draggable.attributes}
    className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
    onClick={(e) => {
      e.stopPropagation();
      setSelectedElement(element)
    }}
    onMouseEnter={() => setMouseIsOver(true)}
    onMouseLeave={() => setMouseIsOver(false)}
  >
    <div
      ref={topHalf.setNodeRef}
      className="absolute  w-full h-1/2 rounded-t-md"></div>
    <div
      ref={bottomHalf.setNodeRef}
      className="absolute w-full h-1/2 bottom-0 rounded-b-md">
    </div>
    {
      mouseIsOver && (
        <>
          <div className="absolute right-0 h-full text-white ">
            <Button className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500 text-white hover:bg-red-600" onClick={() => removeElement(element.id)} >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">Click for properties or drag to move</p>
          </div>
        </>
      )
    }
    {
      topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md rounded-b-none h-[7px] bg-primary "></div>
      )
    }
    <div className={cn("flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
      mouseIsOver && "opacity-30",

    )}>
      <DesignerElement elementInstance={element} />
    </div>{" "}

    {
      bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md rounded-t-none h-[7px] bg-primary "></div>
      )
    }
  </div>)
}

export default DesignerElementWrappper