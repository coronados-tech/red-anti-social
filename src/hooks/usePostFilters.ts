import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SearchableUser } from '../components/UserSearch';
import type { Post } from '../types';
import { extractTagsFromPosts, filterPosts } from '../utils/filterPosts';

interface UsePostFiltersOptions {
  syncTagWithUrl?: boolean;
}

export function usePostFilters(posts: Post[], options: UsePostFiltersOptions = {}) {
  const { syncTagWithUrl = false } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const [tagFilter, setTagFilterState] = useState('');
  const [textFilter, setTextFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedUser, setSelectedUser] = useState<SearchableUser | null>(null);

  useEffect(() => {
    if (!syncTagWithUrl) return;

    setTagFilterState(searchParams.get('tag') ?? '');
  }, [searchParams, syncTagWithUrl]);

  function setTagFilter(tag: string) {
    setTagFilterState(tag);

    if (!syncTagWithUrl) return;

    if (tag) {
      setSearchParams({ tag }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  const allTags = useMemo(() => extractTagsFromPosts(posts), [posts]);

  const filteredPosts = useMemo(
    () =>
      filterPosts(posts, {
        tagFilter,
        textFilter,
        dateFrom,
        dateTo,
        userId: selectedUser?.id ?? null,
      }),
    [posts, tagFilter, textFilter, dateFrom, dateTo, selectedUser],
  );

  const hasActiveFilters =
    tagFilter !== '' ||
    textFilter.trim() !== '' ||
    dateFrom !== '' ||
    dateTo !== '' ||
    selectedUser !== null;

  function clearFilters() {
    setTagFilterState('');
    setTextFilter('');
    setDateFrom('');
    setDateTo('');
    setSelectedUser(null);

    if (syncTagWithUrl) {
      setSearchParams({}, { replace: true });
    }
  }

  return {
    tagFilter,
    setTagFilter,
    textFilter,
    setTextFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    selectedUser,
    setSelectedUser,
    allTags,
    filteredPosts,
    hasActiveFilters,
    clearFilters,
  };
}
