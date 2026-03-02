import AdminProductsPage from '@/components/pages/AdminProductsPage'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminProductsPage />
    </Suspense>
  )
}
