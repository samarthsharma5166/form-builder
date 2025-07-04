"use client"

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { FormElementInstance } from "../FormElement"

type DesignerContextType = {
    elements: FormElementInstance[];
    addElement: (index: number, element: FormElementInstance) => void;
    setElements: Dispatch<SetStateAction<FormElementInstance[]>>
    removeElement: (id: string) => void;
    selectedElement: FormElementInstance | null;
    setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>
    updateElement: (id:string,element:FormElementInstance) => void
}
export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({ children }: {
    children: React.ReactNode
}) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null);
    const addElement = (index: number, element: FormElementInstance) => {
        setElements((prev) => {
            const newElements = [...prev];
            newElements.splice(index, 0, element);
            return newElements
        })
    }

    const removeElement = (id: string) => {
        setElements((prev) => prev.filter((element) => element.id !== id))
    }
    const updateElement = (id:string,element:FormElementInstance) => {
        setElements((prev)=>{
            const newElements = [...prev];
            const index = newElements.findIndex((element) => element.id === id);
            newElements[index] = element;
            return newElements
        })
    }
    return <DesignerContext.Provider value={{
        elements,
        addElement,
        setElements,
        removeElement,
        selectedElement,
        setSelectedElement,
        updateElement
    }}>
        {children}
    </DesignerContext.Provider>
}