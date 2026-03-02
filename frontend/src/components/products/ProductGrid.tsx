import { Product } from '@/types';
import { ProductCardPremium } from './ProductCardPremium';
import { StaggerContainer, Slide } from '@/design-system/components/motion';
import { memo } from 'react';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const gridCols: Record<NonNullable<ProductGridProps['columns']>, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

function ProductGridComponent({ products, columns = 4 }: ProductGridProps) {
  return (
    <StaggerContainer staggerDelay={0.05} className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product, index) => (
        <Slide key={product.id} direction="up" delay={index * 0.03}>
          <ProductCardPremium product={product} />
        </Slide>
      ))}
    </StaggerContainer>
  );
}

export const ProductGrid = memo(ProductGridComponent);
