import FormElementSidebar from "./FormElementSidebar";
import useDesigner from "./hooks/useDesigner"
import PropertiesFormSidebar from "./PropertiesFormSidebar";

function DesignerSideBar() {
  const { selectedElement } = useDesigner()!;
  return (
    <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 overflow-y-auto bg-background">
      {!selectedElement && <FormElementSidebar />}
      {selectedElement && <PropertiesFormSidebar />}
    </aside>
  )
}

export default DesignerSideBar