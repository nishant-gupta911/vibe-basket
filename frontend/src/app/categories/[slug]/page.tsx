import CategoryPageComponent from '@/components/pages/CategoryPageComponent'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CategoryPageComponent slug={slug} />
}
