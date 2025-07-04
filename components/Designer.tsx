"use client"

import { cn } from "@/lib/utils";
import DesignerSideBar from "./DesignerSideBar"
import { useDndMonitor, useDroppable } from "@dnd-kit/core"
import { ElementsType, FormElement } from "./FormElement";
import useDesigner from "./hooks/useDesigner";
import { idGenrator } from "./idGenrator";
import DesignerElementWrappper from "./DesignerElementWrappper";
function Designer() {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner()!;
  const dropable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    }
  });


  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

      // First senerio
      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElement[type as ElementsType].constructor(idGenrator());
        if (!addElement) return;
        addElement(elements?.length || 0, newElement);
        return;
      }



      // second senerio
      const isDropingOverDesignerElementTopHalf = over.data.current?.isTopHalfDesignerElement;
      const isDropingOverDesignerElementBottomHalf = over.data.current?.isBottomHalfDesignerElement;
      const isDropingOverDesignerElement = isDropingOverDesignerElementTopHalf | isDropingOverDesignerElementBottomHalf
      const droppingSidebarBtnOverDesignerElement= isDesignerBtnElement && isDropingOverDesignerElement;
      if (droppingSidebarBtnOverDesignerElement){
        const type = active.data?.current?.type;
        const newElement = FormElement[type as ElementsType].constructor(idGenrator());
        if (!addElement) return;
        const overId = over.data?.current?.
          elementId
;
        console.log("aadsfadsfads", over.data?.current?.
          elementId
)
        const overElementIndex = elements.findIndex((el) => el.id === overId); 
        console.log(overElementIndex);
        if (overElementIndex === -1){
          throw new Error("Element not found")
        }
        let indexForNewElement = overElementIndex;
        if(isDropingOverDesignerElementBottomHalf){indexForNewElement += 1}
        addElement(indexForNewElement, newElement);
        return;
      }


      // Third Senerio

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

      const draggingDesignerElementOverAnotherDesignerElement = isDropingOverDesignerElement && isDraggingDesignerElement;

      if (draggingDesignerElementOverAnotherDesignerElement){
        const activeId = active.data.current?.elementId;
        const overId = over.data.current?.elementId;

        const activeElementIndex = elements.findIndex((el) => el.id === activeId);
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1) throw new Error("Element not found");
        const activeElement = {...elements[activeElementIndex]};
        removeElement(activeId);
        let indexForNewElement = overElementIndex;
        if (isDropingOverDesignerElementBottomHalf) { indexForNewElement += 1 }
        addElement(indexForNewElement, activeElement);
      }

    }
  })

  return (
    <div className="w-full h-full flex ">
      <div className="p-4 w-full"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}>
        <div
          ref={dropable.setNodeRef}
          className={cn("bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start overflow-y-auto", dropable.isOver && "ring-2 ring-primary/20")}>
          {!dropable.isOver && elements?.length === 0 && <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
            Drop Here
          </p>}
          {
            dropable.isOver && elements?.length === 0 && (
              <div className="p-4 w-full">
                <div className="h-[120px] rounded-md bg-primary/20">

                </div>
              </div>
            )
          }
          {
            elements && elements?.length > 0 && (
              <div className="flex flex-col w-full gap-2 p-4">
                {
                  elements.map(element => (
                    <DesignerElementWrappper key={element.id} element={element} />
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
      <DesignerSideBar />
    </div>
  )
}

export default Designer