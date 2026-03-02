import type { Metadata } from 'next'
import '@/index.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Vibe Basket - Premium E-commerce Store',
  description: 'Shop the latest trends with unbeatable prices. Free shipping on orders over $50.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
