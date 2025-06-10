"use server";

import { createFormInDb, GetFormsFromDB, GetFormStateFromDB, GetFromByIdFromDB } from "./form.server";
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