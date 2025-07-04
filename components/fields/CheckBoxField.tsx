"use client";

import { IoMdCheckbox } from "react-icons/io";
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
import { Checkbox } from "../ui/checkbox";
const type: ElementsType = "CheckboxField"

const extraAttributes =
{
    label: "Checkbox Field",
    helperText: "Helper Text",
    required: false,
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean(),
})


export const CheckboxFieldFormElement: FormElement = {
    type,
    constructor: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: IoMdCheckbox,
        label: "Checkbox Field"
    },
    designerComponent: DesignerComponent,
    formComponent:  FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formElement:FormElementInstance,currentValue:string):boolean=>{
        const element = formElement  as  CustomInstance;
        if(element.extraAttributes.required){
            return currentValue === 'true'
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
    const { label, helperText, required } = element.extraAttributes;
    const id = `checkbox-${element.id}`
    return (
        <div className="flex items-top space-x-2 ">
            <div className="grid gap-1.5 leading-none">
                <Checkbox id={id} />
                <Label htmlFor={id}>{label} {required && "*"}</Label>
                {helperText && <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>}
            </div>
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
    const [value,setValue] = useState<boolean>(defaultValues === "true" ? true : false);
    const [error,setError] = useState(false);
    const { label, helperText, required } = element.extraAttributes;

    useEffect(()=>{
        setError(isInvalid === true);
    },[isInvalid])
    const id = `checkbox-${element.id}`
    return (
        <div className="flex items-top space-x-2 ">
            <div className="grid gap-1.5 leading-none">
                <Checkbox
                 id={id}
                  checked={value}
                   className={cn(error && "border-red-500")}
                   onCheckedChange={(checked)=>{
                     let value =  false
                     if(checked === true) value = true;
                    setValue(value);
                    if(!submitValue) return;
                       const stringValue = value ? "true" : "false"
                    const valid = CheckboxFieldFormElement.validate(element,stringValue);
                    setError(!valid);
                    if(!valid) return;
                    submitValue(element.id,stringValue);
                   }}
                   />
                <Label htmlFor={id} className={cn(error && "text-red-500")}>{label} {required && "*"}</Label>
                {helperText && <p className={cn("text-[0.8rem] text-muted-foreground", error && "text-red-500")}>{helperText}</p>}
            </div>
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
        }
    });

    useEffect(()=>{
        form.reset(element.extraAttributes);
    },[element,form]);

    function applyChanges(values:propertiesFormSchemaType){
        const {helperText,label,required} = values;
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                helperText,
                label,
                required
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

