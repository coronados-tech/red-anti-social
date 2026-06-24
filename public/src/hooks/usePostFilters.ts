import { useMemo, useState } from 'react';
import type { SearchableUser } from '../components/UserSearch';
import type { Post } from '../types';
import { extractTagsFromPosts, filterPosts } from '../utils/filterPosts';

export function usePostFilters(posts: Post[]) {
  const [tagFilter, setTagFilter] = useState('');
  const [textFilter, setTextFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedUser, setSelectedUser] = useState<SearchableUser | null>(null);

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
    setTagFilter('');
    setTextFilter('');
    setDateFrom('');
    setDateTo('');
    setSelectedUser(null);
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
