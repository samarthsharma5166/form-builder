import { Button } from './ui/button'
import { MdOutlinePublish } from 'react-icons/md'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FaIcons, FaSpinner } from 'react-icons/fa'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { PublistFormAction } from '@/actions/form'
import { useRouter } from 'next/navigation'

function PublishFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  async function PublishForm() {
    try {
      await PublistFormAction(id);
      toast.success("Form published successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
          <MdOutlinePublish className="h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. After publishing you will not be able to edit <br /> <br />
            <span className='font-medium'>
              By publishing this form  you will make it available to the public and you will be able to collect submission.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={e => {
            e.preventDefault();
            startTransition(PublishForm)
          }}>Proceed {loading && <FaSpinner className="animate-spin h-4 w-4" />}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn