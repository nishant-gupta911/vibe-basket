import WishlistPage from '@/components/pages/WishlistPage'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WishlistPage />
    </Suspense>
  )
}
