import { Suspense } from 'react'
import VitalsContent from './VitalsContent'

export default function VitalsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading patient vitals form...</p>
      </div>
    }>
      <VitalsContent />
    </Suspense>
  )
}

// Optional: agar pura route dynamic chahiye to yeh add kar sakte ho
// export const dynamic = 'force-dynamic'