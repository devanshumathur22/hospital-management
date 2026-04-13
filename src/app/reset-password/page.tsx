"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

/* ================= INNER COMPONENT ================= */

function ResetPasswordInner(){

  const params = useSearchParams()
  const token = params.get("token")

  return (
    <div className="p-10">
      <h1>Reset Password</h1>
      <p>Token: {token}</p>
    </div>
  )
}

/* ================= WRAPPER ================= */

export default function ResetPassword(){
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  )
}