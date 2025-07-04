"use client";
import { ElementsType, FormElement, FormElementInstance } from "../FormElement";
import { Label } from "../ui/label";
import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";
const type: ElementsType = "SeparatorField"

export const SeparatorFieldFormElement: FormElement = {
    type,
    constructor: (id: string) => ({
        id,
        type,
    }),
    designerBtnElement: {
        icon: RiSeparator,
        label: "Separator Field"
    },
    designerComponent: DesignerComponent,
    formComponent:  FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true
}

function DesignerComponent({
    elementInstance
}: { elementInstance: FormElementInstance }) {
   
    return (
        <div className="flex flex-col gap-2 w-full ">
            <Label className="text-muted-foreground">Separator field</Label>
            <Separator/>
        </div>
    )
}

function FormComponent({
    elementInstance,
}: {
     elementInstance: FormElementInstance
    }) {
    return (
        <Separator/>
    )
}

function PropertiesComponent({
    elementInstance
}: {
    elementInstance: FormElementInstance
}) {
   return <p>no properties for this element</p>
}

