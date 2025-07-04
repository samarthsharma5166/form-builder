"use client"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { LaptopMinimal, MoonIcon, SunIcon } from "lucide-react";

function ThemeSwitcher() {
  const {theme ,setTheme } = useTheme();
  const [mounted,setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  })
  if(!mounted) return null;
  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border">
        <TabsTrigger value="light" onClick={() => setTheme("light")}>
          <SunIcon className="h-[1.2rem] w-[1.2rem]"/>
        </TabsTrigger>

        <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
          <MoonIcon
            className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${theme === "dark" ? "rotate-0" : "rotate-180"
              }`}/>
        </TabsTrigger>

        <TabsTrigger value="system" onClick={() => setTheme("system")}>
          <LaptopMinimal  className="h-[1.2rem] w-[1.2rem]" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default ThemeSwitcher