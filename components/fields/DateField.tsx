"use client";

import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElement";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import {CalendarIcon} from '@radix-ui/react-icons'

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
import { BsFillCalendarDateFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "../ui/calendar";
const type: ElementsType = "DateField"

const extraAttributes =
{
    label: "Date Field",
    helperText: "Pick a date",
    required: false,
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean(),
})


export const DateFieldFormElement: FormElement = {
    type,
    constructor: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: BsFillCalendarDateFill,
        label: "Date Field"
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
    const { label, helperText, required } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full ">
            <Label>{label} {required && "*"}</Label>
            <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 w-4 h-4"/>
                <span>Pick a date</span>
            </Button>
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
   const [date,setDate] = useState<Date | undefined>(defaultValues ? new Date(defaultValues) : undefined);
    const [error,setError] = useState(false);
    const { label, helperText, required } = element.extraAttributes;

    useEffect(()=>{
        setError(isInvalid === true);
    },[isInvalid])

    return (
        <div className="flex flex-col gap-2 w-full ">
            <Label className={cn(error && "text-red-500")}>{label} {required && "*"}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    !error && "border-red-500"
                    )}>
                        <CalendarIcon className="mr-2 w-4 h-4" />
                        {date ? format(date,"PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={(date)=>{
                        setDate(date);
                        if(!submitValue) return;
                        const value = date?.toUTCString() || "";
                        const valid = DateFieldFormElement.validate(element,value);
                        setError(!valid);
                        submitValue(element.id,value);
                    }}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
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
                required,
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

