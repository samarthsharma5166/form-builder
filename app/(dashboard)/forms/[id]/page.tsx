import {GetFormById, GetFormWithSubmission} from '@/actions/form'
import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import { StatsCard } from '../../page';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';
import { FaWpforms } from 'react-icons/fa';
import { LuView } from 'react-icons/lu';
import { ElementsType, FormElementInstance } from '@/components/FormElement';
import {  ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {Checkbox} from '@/components/ui/checkbox'
import { format, formatDistance } from 'date-fns';
import { Badge } from '@/components/ui/badge';
async function FormDetailPage({params}:{
  params:{
    id:string;
  }
}) {
  const param = await params;
  const form = await GetFormById(Number(param.id));
  if(!form){
    throw new Error("Form not found");
  }


  const {visits, submission} = form;

  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submission / visits) * 100;
  }

  // const bounceRate = 100 - submissionRate;

  return (
    <>
    <div className='py-10  border-b border-muted'>
      <div className='flex justify-between container'>
        <h1 className="text-4xl font-bold truncate">
          {form.name}
        </h1>
        <VisitBtn shareUrl={form.shareUrl} />
      </div>
      </div>
      <div className='py-4 border-b border-muted'>
        <div className="container flex gap-2 items-center justify-between">
    
              <FormLinkShare shareUrl={form.shareUrl} />
           
        </div>
    </div>
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
      <StatsCard
              className="shadow-md shadow-blue-600"
              title="Total visits"
              loading={false}
              helperText={"All time form visits"}
              value={visits.toLocaleString() || ""}
              icon={<LuView className="text-blue-600" />}
            />
      
            <StatsCard
              className="shadow-md shadow-yellow-600"
              title="Total submissions"
              loading={false}
              helperText={"All time form submissions"}
              value={submission.toLocaleString() + "%" || ""}
              icon={<FaWpforms className="text-yellow-600" />}
            />
      
            <StatsCard
              className="shadow-md shadow-green-600"
              title="Submission rate"
              loading={false}
              helperText={"visits that result in form submission"}
              value={submissionRate.toLocaleString() + "%" || ""}
              icon={<HiCursorClick className="text-green-600" />}
            />
      
            <StatsCard
              className="shadow-md shadow-red-600"
              title="Bounce rate"
              loading={false}
              helperText={"visits that leaves without interacting"}
              value={submission.toLocaleString() || ""}
              icon={<TbArrowBounce className="text-red-600" />}
            />
    </div>
    <div className="container pt-10">
      <SubmissionTable id={form.id}/>
    </div>
    </>
  )
}

export default FormDetailPage

type Row = {
  [key: string]: string
} & {
  sumittedAt:Date;
}

async function SubmissionTable({id}:{
  id:number;
}){
  const form = await GetFormWithSubmission(id); 
  if(!form){
    throw new Error("Form not found");
  }
  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns:{
    id:string;
    label:string;
    required:boolean;
    type:ElementsType
  }[] =[];

  formElements.forEach(element=>{
    switch(element.type){
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "CheckboxField":
      case "DateField":
      case "ParagraphField":
      case "SelectField":
      case "SeparatorField":
      case "SpacerField":
      case "SubTitleField":
      case "TitleField":
        columns.push({
          id:element.id,
          label:element.extraAttributes?.label as string,
          required:element.extraAttributes?.required as boolean,
          type:element.type as ElementsType
        })
        break;
      default:
        break;
    }
  })
  const rows:Row[] = [];

  form.FormSubmissions.forEach(submission=>{
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      sumittedAt:submission.createdAt
    })
  })
  return <>
    <h1 className='text-2xl font-bold my-4'>Submissions</h1>
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col=>(
            <TableHead key={col.id}>{col.label}</TableHead>
          ))}
          <TableHead className='text-muted-foreground text-right uppercase'>Submitted at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            rows.map((row,index)=>(
              <TableRow key={index} className='border-b border-muted'>
                {
                  columns.map(col=>(
                    <RowCell key={col.id} type={col.type} value={row[col.id]}/>
                  ))
                }
                <TableCell className='text-muted-foreground text-right'>
                  {
                    formatDistance(row.sumittedAt, new Date(), { addSuffix: true })
                  }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  </>
}

function RowCell({type,value}:{type:ElementsType,value:string}){
  let node:ReactNode = value;
  
  switch(type){
    case "DateField":
      if(!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>
        {format(date,"dd/MM/yyyy")}
      </Badge>
    break;

    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled/>
    break;
  }

  return <TableCell>{node}</TableCell>
}