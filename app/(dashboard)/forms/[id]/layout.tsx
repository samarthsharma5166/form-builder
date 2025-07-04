import { ReactNode } from "react"

function layout({children}:{children: ReactNode}) {
  return (
    <div className="flex w-full flex-col flex-grow mx-auto container">{children}</div>
  )
}

export default layout