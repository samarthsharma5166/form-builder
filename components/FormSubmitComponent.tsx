"use client";

import { HiCursorClick } from "react-icons/hi";
import { FormElement as FormElements, FormElementInstance } from "./FormElement";
import { Button } from "./ui/button";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/form";

function FormSubmitComponent({
    formUrl,
    formContent
}:{
    formUrl:string;
    formContent:FormElementInstance[];
}) {

    const formValues = useRef<{[key:string]:string}>({});
    const formErrors = useRef<{[key:string]:boolean}>({});
    const [renderKey, setRenderKey] = useState(new Date().getTime());
    const [submitted,setSubmitted] = useState(false);
    const [pending,startTransition] = useTransition();

    const validateForm:()=>boolean = useCallback(()=>{
        for(const field of formContent){
            const actualValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field,actualValue);
            if(!valid){
                formErrors.current[field.id] = true;
            }
        }
        if(Object.keys(formErrors.current).length > 0){
            return false;
        }
        return true;
    },[formContent]);

    const submitValue = useCallback((key:string,value:string)=>{
        formValues.current[key] = value
    },[]);

    const submitForm =async()=>{
        formErrors.current = {};
        const validForm = validateForm();
        if(!validForm){
            setRenderKey(new Date().getTime())
            toast.error('please check the form for errors')
            return;
        }

        try {
            const jsonContent = JSON.stringify(formValues.current);
            await SubmitForm(formUrl,jsonContent)
            setSubmitted(true);
        } catch (error) {
            console.log(error);
            toast.error('something went wrong, please try again')
        }
        console.log("Form values",formValues.current);
    }

    if(submitted){
        return(
            <div className="flex justify-center w-full h-full items-center p-8">
                <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
                    <h1 className="text-2xl font-bold">
                        Form Submitted
                    </h1>
                    <p className="text-muted-foreground">
                        Thank. you for submitting the form, you can close this page now.
                    </p>
                </div>
            </div>
        )
    }
  return (
    <div className="flex justify-center w-full h-full items-center p-8">
        <div key={renderKey} className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
            {
                formContent.map((element) => {
                    const FormElement = FormElements[element.type].formComponent;
                    return <FormElement key={element.id} elementInstance={element} defaultValues={formValues.current[element.id]} isInvalid={formErrors.current[element.id]} submitValue={submitValue}/>
                })
            }
            <Button
            disabled={pending}
             className="mt-8"
              onClick={()=>{
                  startTransition(submitForm);
            }}>
                {!pending && <>
                    <HiCursorClick className="mr-2"/>
                    Submit
                </>}
                  {pending && <ImSpinner2 className="animate-spin"/>}
            </Button>
        </div>
    </div>
  )
}

export default FormSubmitComponent