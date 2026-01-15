import ProductsPage from '@/components/pages/ProductsPage'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPage />
    </Suspense>
  )
}
