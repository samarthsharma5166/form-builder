import { prisma } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { fromSchema, fromType } from "@/schemas/form";

class UserNotFoundErr extends Error {}

export async function GetFormStateFromDB() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submission: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submission = stats._sum.submission || 0;

  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submission / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return { visits, submission, submissionRate, bounceRate };
}

export async function createFormInDb(data: fromType) {
  const validation = fromSchema.safeParse(data);
  
  if (!validation.success) {
    throw new Error("form not valid");
  }
  const user = await currentUser();

    if (!user) {
    throw new UserNotFoundErr();
}
  const newForm = await prisma.form.create({
    data: {
      name: data.name,
      description: data.description,
      userId: user.id,
    },
  });


  return newForm.id;
}


export async function GetFormsFromDB(){
    const user = await currentUser();

    if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy:{
      createdAt:"desc"
    }
  });

}

export async function GetFromByIdFromDB(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundErr();
  }
  return await prisma.form.findFirst({
    where: {
      id,
      userId: user.id,
    },
  })
}