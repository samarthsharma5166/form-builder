import {GetFormById} from '@/actions/form'
import FormBuilder from '@/components/FormBuilder';
async function BuilderPage({params}:{
  params:{
    id:string;
  }
}) {
  const param = await params;
  const form = await GetFormById(Number(param.id));
  if(!form){
    throw new Error("Form not found");
  }
  return (
    <FormBuilder form={form} />
  )
}

export default BuilderPage