import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { getPostsPage, POSTS_PAGE_SIZE } from '../api/posts';
import type { Post } from '../types';

const LOAD_MORE_OFFSET_PX = 320;

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error';
}

export interface UseInfinitePostsResult {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string;
  hasMore: boolean;
  loadMore: () => void;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export function useInfinitePosts(viewerId?: number): UseInfinitePostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    const requestId = ++requestIdRef.current;

    if (append) {
      loadingMoreRef.current = true;
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const result = await getPostsPage(pageNum, POSTS_PAGE_SIZE, viewerId);

      if (requestId !== requestIdRef.current) return;

      setPosts((prev) => (append ? [...prev, ...result.items] : result.items));
      pageRef.current = result.page;
      setHasMore(result.hasMore);
      hasMoreRef.current = result.hasMore;
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(toErrorMessage(err));
    } finally {
      if (requestId !== requestIdRef.current) return;

      loadingMoreRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [viewerId]);

  const tryLoadMore = useCallback(() => {
    const node = sentinelRef.current;
    if (!node || !hasMoreRef.current || loadingMoreRef.current) return;

    const rect = node.getBoundingClientRect();
    if (rect.top <= window.innerHeight + LOAD_MORE_OFFSET_PX) {
      void fetchPage(pageRef.current + 1, true);
    }
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMoreRef.current || loadingMoreRef.current) return;
    void fetchPage(pageRef.current + 1, true);
  }, [fetchPage]);

  useEffect(() => {
    setPosts([]);
    pageRef.current = 1;
    setHasMore(true);
    hasMoreRef.current = true;
    setError('');
    void fetchPage(1, false);
  }, [fetchPage]);

  useEffect(() => {
    if (loading || loadingMore) return;

    const onScroll = () => tryLoadMore();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    requestAnimationFrame(() => {
      tryLoadMore();
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [loading, loadingMore, hasMore, posts.length, tryLoadMore]);

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    sentinelRef,
  };
}
