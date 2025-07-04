import { GetForms, GetFormState } from "@/actions/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { LuView } from 'react-icons/lu'
import { FaEdit, FaWpforms } from 'react-icons/fa'
import { HiCursorClick } from 'react-icons/hi'
import { TbArrowBounce } from 'react-icons/tb'
import { Separator } from "@/components/ui/separator"
import CreateFormButton from "@/components/CreateFormButton";
import { Form } from "@/lib/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns"
import { Button } from "@/components/ui/button";
import { BiRightArrowAlt } from "react-icons/bi"
import Link from "next/link";
export default function Home() {
  return (
    <div className="container pt-4 mx-auto">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator orientation="horizontal" className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormButton />
        <Suspense fallback={[1, 2, 3, 4].map((i) => <FormCardSkeleton key={i} />)}>
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormState();
  return <StatsCards loading={false} data={stats} />
}

interface StateCardProp {
  data?: Awaited<ReturnType<typeof GetFormState>>;
  loading: boolean
}

function StatsCards(props: StateCardProp) {
  const { data, loading } = props;
  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
      <StatsCard
        className="shadow-md shadow-blue-600"
        title="Total visits"
        loading={loading}
        helperText={"All time form visits"}
        value={data?.visits.toLocaleString() || ""}
        icon={<LuView className="text-blue-600" />}
      />

      <StatsCard
        className="shadow-md shadow-yellow-600"
        title="Total submissions"
        loading={loading}
        helperText={"All time form submissions"}
        value={data?.submission.toLocaleString() + "%" || ""}
        icon={<FaWpforms className="text-yellow-600" />}
      />

      <StatsCard
        className="shadow-md shadow-green-600"
        title="Submission rate"
        loading={loading}
        helperText={"visits that result in form submission"}
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        icon={<HiCursorClick className="text-green-600" />}
      />

      <StatsCard
        className="shadow-md shadow-red-600"
        title="Bounce rate"
        loading={loading}
        helperText={"visits that leaves without interacting"}
        value={data?.submission.toLocaleString() || ""}
        icon={<TbArrowBounce className="text-red-600" />}
      />
    </div>
  )
}


export function StatsCard(
  {
    title,
    loading,
    helperText,
    value,
    icon,
    className
  }: {
    title: string;
    loading: boolean;
    helperText: string;
    value: string;
    icon: React.ReactNode
    className: string
  }
) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {
            loading && <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          }{
            !loading && value
          }
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  )
}

function FormCardSkeleton() {
  return <Skeleton className="border border-primary/20 h-[190px] w-full" />
}

async function FormCards() {
  const form = await GetForms();
  return <>{

    form.map((form) =>
      <FormCard key={form.id} form={form} />
    )
  }</>
}

function FormCard({ form }: { form: Form }) {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 justify-between">
        <span className="truncate font-bold" >{form.name}</span>
        {form.published ? <Badge>Published</Badge> : <Badge variant={"destructive"}>Draft</Badge>}
      </CardTitle>
      <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
        {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
        {form.published && <span className="flex items-center gap-2">
          <LuView className="text-muted-foreground" /> <span >{form.visits.toLocaleString()}</span>
          <FaWpforms className="text-muted-foreground" /> <span >{form.submission.toLocaleString()}</span>

        </span>}
      </CardDescription>
    </CardHeader>
    <CardContent className="h-[20px] truncate text-sm text-foreground-muted">
      {form.description || "No description"}
    </CardContent>
    <CardFooter>
      {form.published ? <Button asChild className="w-full mt-2 text-md gap-4">
        <Link href={`/forms/${form.id}`}>View Submissions <BiRightArrowAlt/> </Link>
      </Button> : <Button variant={"secondary"} asChild className="w-full mt-2 text-md gap-4">
        <Link href={`/builder/${form.id}`}>Edit Form <FaEdit /> </Link>
      </Button>}
    </CardFooter>
  </Card>)
}