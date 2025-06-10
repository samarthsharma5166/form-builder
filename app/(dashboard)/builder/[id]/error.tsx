"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

function ErrorPage({ error }: { error: Error }) {
    useEffect(() => {
        console.error(error)
    },[error])
    return (
        <div className="w-full h-full flex items-center justify-center flex-col"> 
            <h2 className="text-destructive text-4xl">
                Something went wrong
            </h2>
            <Button asChild className="mt-4">
                <Link href="/">Go Home</Link>
            </Button>
        </div>
    )
}

export default ErrorPage