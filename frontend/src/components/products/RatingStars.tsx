import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 12,
  md: 16,
  lg: 20,
};

export function RatingStars({ rating, reviewCount, showCount = true, size = 'md' }: RatingStarsProps) {
  const starSize = sizeMap[size];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={starSize}
            className={
              i < fullStars
                ? 'fill-star-filled text-star-filled'
                : i === fullStars && hasHalfStar
                ? 'fill-star-filled/50 text-star-filled'
                : 'fill-star-empty text-star-empty'
            }
          />
        ))}
      </div>
      {showCount && reviewCount && (
        <span className="text-muted-foreground text-sm ml-1">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
