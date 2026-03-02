import CategoryPageComponent from '@/components/pages/CategoryPageComponent'

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return <CategoryPageComponent category={decodeURIComponent(category)} />
}
