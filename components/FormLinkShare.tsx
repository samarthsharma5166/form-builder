'use client'

import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import { Input } from "./ui/input";
import { ImShare } from "react-icons/im";
import { toast } from "sonner";

const FormLinkShare = ({shareUrl}:{shareUrl:string}) => {
    const [mounted,setMounted] = useState<boolean | null>(null);
    const shareLink = `${window.location.origin}/submit/${shareUrl}`
    useEffect(() => {
        setMounted(true);
    },[])
    if(!mounted){return null}
    return (
    <div className="flex flex-grow gap-4 items-center">
      <Input value={shareLink} readOnly={true} />
      <Button className="w-[250px]" onClick={()=>{
        navigator.clipboard.writeText(shareLink)
        toast.success("Link copied to clipboard")
        }}>
        <ImShare className="mr-2 w-4 h-4"/>
        Copy Link
      </Button>
    </div>
  )
}

export default FormLinkShare