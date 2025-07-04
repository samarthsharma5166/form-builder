"use client";

import { MdTextFields } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElement";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
const type: ElementsType = "TextField"

const extraAttributes =
{
    label: "Text Field",
    helperText: "Helper Text",
    required: false,
    placeholder: "value here ...",
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean(),
    placeholder: z.string().max(50),

})


export const TextFieldFormElement: FormElement = {
    type,
    constructor: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: MdTextFields,
        label: "Text Field"
    },
    designerComponent: DesignerComponent,
    formComponent:  FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formElement:FormElementInstance,currentValue:string):boolean=>{
        const element = formElement  as  CustomInstance;
        if(element.extraAttributes.required){
            return currentValue.length > 0
        }     
        return true;     
    }
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function DesignerComponent({
    elementInstance
}: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance;
    const { label, helperText, required, placeholder } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full ">
            <Label>{label} {required && "*"}</Label>
            <Input readOnly disabled placeholder={placeholder} />
            {helperText && <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>}
        </div>
    )
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValues
}: {
     elementInstance: FormElementInstance
    submitValue?:SubmitFunction
    isInvalid?:boolean
        defaultValues?:string
    }) {
    const element = elementInstance as CustomInstance;
    const [value,setValue] = useState(defaultValues || "");
    const [error,setError] = useState(false);
    const { label, helperText, required, placeholder } = element.extraAttributes;

    useEffect(()=>{
        setError(isInvalid === true);
    },[isInvalid])

    return (
        <div className="flex flex-col gap-2 w-full ">
            <Label className={cn(error && "text-red-500")}>{label} {required && "*"}</Label>
            <Input className={cn(error && "border-red-500")} placeholder={placeholder} onChange={(e)=>setValue(e.target.value)}
             onBlur={(e)=>{
                if(!submitValue) return;
                const valid = TextFieldFormElement.validate(element,e.target.value);
                setError(!valid);
                if(!valid) return;
                submitValue(element.id,e.target.value);  
            }}
            value={value}
            />
            {helperText && <p className={cn("text-[0.8rem] text-muted-foreground",error && "text-red-500")}>{helperText}</p>}
        </div>
    )
}

function PropertiesComponent({
    elementInstance
}: {
    elementInstance: FormElementInstance
}) {
    const element = elementInstance as CustomInstance;
    const {updateElement} = useDesigner()!;
     const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues:{
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
            placeholder: element.extraAttributes.placeholder
        }
    });

    useEffect(()=>{
        form.reset(element.extraAttributes);
    },[element,form]);

    function applyChanges(values:propertiesFormSchemaType){
        const {helperText,label,required,placeholder} = values;
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                helperText,
                label,
                required,
                placeholder
            }
        })
    }
    return <Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} onSubmit={e=>{e.preventDefault()}} className="space-y-3 ">
        <FormField
         control={form.control}
         name="label"
         render={({field})=>(
            <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                    <Input {...field}
                        onKeyDown={(e)=>{
                            if(e.key === "Enter") e.currentTarget.blur();
                        }}
                    />
                </FormControl>
                <FormDescription>
                    The label of the field. <br/>It will be displayed above the field
                </FormDescription>
                <FormMessage />
            </FormItem>
         )}
         ></FormField>


            <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>PlaceHolder</FormLabel>
                        <FormControl>
                            <Input {...field}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") e.currentTarget.blur();
                                }}
                            />
                        </FormControl>
                        <FormDescription>
                            The placeholder of the field.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            ></FormField>

            <FormField
                control={form.control}
                name="helperText"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Helper Text</FormLabel>
                        <FormControl>
                            <Input
                             {...field}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") e.currentTarget.blur();
                                }}
                            />
                        </FormControl>
                        <FormDescription>
                            The helper text of the field <br/> it will be displayed below the the field.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            ></FormField>

            <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                        <FormLabel>Required</FormLabel>
                        <FormControl>
                            
                        </FormControl>
                        <FormDescription>
                            The helper text of the field <br /> it will be displayed below the the field.
                        </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            ></FormField>
        </form>
    </Form>
}

