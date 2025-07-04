"use server";

import { createFormInDb, GetFormContentByUrlOnServer, GetFormsFromDB, GetFormStateFromDB, GetFormWithSubmissionOnServer, GetFromByIdFromDB, publishFormOnServer, SubmitFormAction, updateFormContentOnServer } from "./form.server";
import { fromType } from "@/schemas/form";

export async function GetFormState() {
  return await GetFormStateFromDB();
}

export async function CreateForm(data: fromType) {
  return await createFormInDb(data);
}


export async function GetForms() {
  return await GetFormsFromDB();
}

export async function GetFormById(id: number) {
  return await GetFromByIdFromDB(id);
}

export async function updateFormContentAction(id:number,jsonContent:string){
 return await updateFormContentOnServer(Number(id),jsonContent);
}

export async function PublistFormAction(id:number){
  return await publishFormOnServer(id);
}

export async function GetFormContentByUrl(formUrl:string){
  return GetFormContentByUrlOnServer(formUrl)
}

export async function SubmitForm(formUrl:string,jsonContent:string){
  return SubmitFormAction(formUrl,jsonContent)
}

export async function GetFormWithSubmission(id:number){
  return GetFormWithSubmissionOnServer(id);
}