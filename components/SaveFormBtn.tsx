import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { HiSaveAs } from 'react-icons/hi'
import useDesigner from './hooks/useDesigner'
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { updateFormContentAction } from '@/actions/form';
function SaveFormBtn({id}:{id:number}) {
  const {elements} = useDesigner()!;
  const [loading,startTransition] = useTransition();
  const updateFormContent = async() => {
    try {
      const jsonElement = JSON.stringify(elements);
      await updateFormContentAction(id, jsonElement);
      toast.success("Form saved successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  } 
  return (
    <Button variant={"outline"} className="gap-2" disabled={loading} onClick={() => startTransition(updateFormContent)}>
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin h-4 w-4"/>}
    </Button>
  )
}

export default SaveFormBtn