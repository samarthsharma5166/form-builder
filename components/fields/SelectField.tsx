"use client";

import { RxDropdownMenu } from "react-icons/rx";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { toast } from "sonner";
const type: ElementsType = "SelectField"

const extraAttributes =
{
    label: "Select Field",
    helperText: "Helper Text",
    required: false,
    placeholder: "value here ...",
    options:[]
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean(),
    placeholder: z.string().max(50),
    options: z.array(z.string()).min(0)
})


export const SelectFieldFormElement: FormElement = {
    type,
    constructor: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: RxDropdownMenu,
        label: "Select Field"
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
            <Select>
                <SelectTrigger className="w-full" >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </Select>
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
    const { label, helperText, required, placeholder,options } = element.extraAttributes;

    useEffect(()=>{
        setError(isInvalid === true);
    },[isInvalid])

    return (
        <div className="flex flex-col gap-2 w-full ">
            <Label className={cn(error && "text-red-500")}>{label} {required && "*"}</Label>
            <Select
                defaultValue={value}
            onValueChange={(value)=>{
                setValue(value)
                if(!submitValue) return;
                const valid = SelectFieldFormElement.validate(element,value);
                setError(!valid);
                if(!valid) return;
                submitValue(element.id,value);
                }}>
                <SelectTrigger className={cn("w-full", error && "border-red-500")} >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {
                        options.map((option,index)=>(
                            <SelectItem key={`${option}-${index}`} value={option}>{option}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
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
    const {updateElement,setSelectedElement} = useDesigner()!;
     const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onSubmit",
        defaultValues:{
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
            placeholder: element.extraAttributes.placeholder,
            options: element.extraAttributes.options 
        }
    });

    useEffect(()=>{
        form.reset(element.extraAttributes);
    },[element,form]);

    function applyChanges(values:propertiesFormSchemaType){
        const {helperText,label,required,placeholder,options} = values;
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                helperText,
                label,
                required,
                placeholder,
                options
            }
        })
        toast.success("Properties saved successfully");
        setSelectedElement(null);
    }
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3 ">
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
            <Separator/>
            <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Options</FormLabel>
                            <Button variant={"outline"} className="gap-2" onClick={(e)=>{
                                e.preventDefault();
                                form.setValue("options", field.value.concat("New option"))
                            }}>
                                <AiOutlinePlus/>
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2">
                            {
                                form.watch("options").map((option,index)=>(
                                    <div key={index} className="flex gap-1 items-center justify-between">
                                        <Input value={option} onChange={(e)=>{
                                            field.value[index] = e.target.value;
                                            field.onChange(field.value);
                                        }}/>
                                        <Button variant={"ghost"} size={"icon"} onClick={(e)=>{
                                            e.preventDefault();
                                            const newOptions = [...field.value]
                                            newOptions.splice(index,1);
                                            field.onChange(newOptions);
                                        }}>
                                            <AiOutlineClose/>
                                        </Button>
                                    </div>
                                ))
                            }
                        </div>
                        <FormDescription>
                            The helper text of the field <br /> it will be displayed below the the field.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            ></FormField>
            <Separator/>
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
            <Separator/>
            <Button className="w-full" type="submit">Save</Button>
        </form>
    </Form>
}

