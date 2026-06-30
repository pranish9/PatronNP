import { useCallback, useRef } from "react";

const useInfiniteScroll = ({ hasMore, loading, onLoadMore }) => {
  const observerRef = useRef(null);

  const sentinelRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, loading, onLoadMore]
  );

  return sentinelRef;
};

export default useInfiniteScroll;
