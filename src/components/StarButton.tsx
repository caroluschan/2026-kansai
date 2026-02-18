import { Star } from 'lucide-react';

interface StarButtonProps {
  isStarred: boolean;
  onToggle: () => void;
  size?: number;
}

export default function StarButton({ isStarred, onToggle, size = 20 }: StarButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="p-1 rounded-full transition-colors hover:bg-gray-100 active:scale-95"
      aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        size={size}
        className={
          isStarred
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 hover:text-gray-400'
        }
      />
    </button>
  );
}
