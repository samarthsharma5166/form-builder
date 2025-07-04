import Link from "next/link"

function Logo() {
  return (
    <Link href="/" className="font-bold text-3xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hover:cursor-pointer">Formly</Link>
  )
}

export default Logo