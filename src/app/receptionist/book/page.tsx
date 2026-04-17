import { Suspense } from "react"
import BookClient from "./BookClient"

export default function Page(){
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <BookClient/>
    </Suspense>
  )
}