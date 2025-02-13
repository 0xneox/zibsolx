import { useEffect, useMemo, useState } from 'react';

interface UseVirtualizationProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualizationProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      items: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      startOffset: startIndex * itemHeight,
      totalHeight: items.length * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  return {
    ...visibleItems,
    onScroll,
  };
}
