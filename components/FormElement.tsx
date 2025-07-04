import React from "react";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";
import { SubTitleFieldFormElement } from "./fields/SubTitleField";
import { ParagraphFieldFormElement } from "./fields/ParagraphField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { NumberFieldFormElement } from "./fields/NumberField";
import { TextAreaFormElement } from "./fields/TextAreaField";
import { DateFieldFormElement } from "./fields/DateField";
import { SelectFieldFormElement } from "./fields/SelectField";
import { CheckboxFieldFormElement } from "./fields/CheckBoxField";

export type ElementsType =
 "TextField" |
 "TitleField" |
 "SubTitleField" |
 "ParagraphField" |
 "SeparatorField" |
 "SpacerField"  |
 "NumberField"  |
 "TextAreaField" |
 "DateField" |
 "SelectField" |
 "CheckboxField"
export type SubmitFunction = (key: string, value: string) => void
export type FormElement = {
    type: ElementsType;

    constructor: (id: string) => FormElementInstance;

    designerBtnElement: {
        icon: React.ElementType,
        label: string
    }

    designerComponent: React.FC<{
        elementInstance: FormElementInstance
    }>;
    formComponent: React.FC<{
        elementInstance: FormElementInstance,
        submitValue?: (key: string, value: string) => void
        isInvalid?: boolean
        defaultValues?:string
    }>;
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance
    }>;
    validate:(FormElement:FormElementInstance,currentValue:string)=>boolean
}

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    extraAttributes?: Record<string, unknown>;
}

type FormElementType = {
    [key in ElementsType]: FormElement
};

export const FormElement: FormElementType = {
    TextField: TextFieldFormElement,
    TitleField:TitleFieldFormElement,
    SubTitleField: SubTitleFieldFormElement,
    ParagraphField:ParagraphFieldFormElement,
    SeparatorField:SeparatorFieldFormElement,
    SpacerField:SpacerFieldFormElement,
    NumberField:NumberFieldFormElement,
    TextAreaField: TextAreaFormElement,
    DateField:DateFieldFormElement,
    SelectField:SelectFieldFormElement,
    CheckboxField:CheckboxFieldFormElement
}