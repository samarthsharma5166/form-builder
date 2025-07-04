import { FormElement } from "./FormElement";
import useDesigner from "./hooks/useDesigner";
import { Button } from "./ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { Separator } from "./ui/separator";

function PropertiesFormSidebar() {
    const { selectedElement } = useDesigner()!;
    if (!selectedElement) return null;
    const PropertiesForm = FormElement[selectedElement?.type].propertiesComponent;
    return (
        <div className="flex flex-col p-2">
            <div className="flex justify-between items-center">
                <p className="text-sm text-foreground/70">Element Properties</p>
                <Button>
                    <AiOutlineClose />
                </Button>
            </div>
            <Separator className="mb-4"/>
            <PropertiesForm  elementInstance={selectedElement}/>
        </div>
    )
}

export default PropertiesFormSidebar