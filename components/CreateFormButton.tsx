"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { BsFileEarmarkPlus } from 'react-icons/bs'
import { ImSpinner2 } from 'react-icons/im'
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

import { zodResolver } from '@hookform/resolvers/zod';

import {useForm} from "react-hook-form";

import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { toast } from 'sonner'
import { fromSchema, fromType } from '@/schemas/form'
import { CreateForm } from '@/actions/form';
import { useRouter } from 'next/navigation'
function CreateFormButton() {
  const router = useRouter();
  const form = useForm<fromType>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  })
async function onSubmit(values: fromType) {
    try {
      const formId = await CreateForm(values);
      toast.success("Success", {
        description: "Form created successfully",
      });
      console.log(formId);
      router.push(`/builder/${formId}`);
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Something went wrong, Please try again",
        
      })
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className='group border border-primary/20 h-[190px] flex items-center justify-center flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4 '>
        <BsFileEarmarkPlus size={50} className='h-8 w-8 text-muted-foreground group-hover:text-primary' />
        <p className='font-bold text-xl text-muted-foreground group-hover:text-primary'>Create new from</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BsFileEarmarkPlus size={20} />
            Create form
          </DialogTitle>
          <DialogDescription>
            Create a new form to start collecting responses
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name = "name"
              render={({ field }) =>(
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                      <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className='w-full mt-4'>
            {form.formState.isSubmitting ? <ImSpinner2 className='animate-spin' /> : "Save"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormButton