'use client'

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const VisitBtn = ({ shareUrl }: { shareUrl: string }) => {
  const [mounted, setMounted] = useState(false);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setShareLink(`${window.location.origin}/submit/${shareUrl}`);
    }
  }, [shareUrl]);

  if (!mounted) return null;

  return (
    <Button className="w-[200px]" onClick={() => window.open(shareLink, "_blank")}>
      VisitBtn
    </Button>
  );
};

export default VisitBtn;
