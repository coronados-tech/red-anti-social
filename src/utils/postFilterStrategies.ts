import type { Post } from '../types';

export interface PostFilterCriteria {
  tagFilter?: string;
  textFilter?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: number | null;
}

export type PostFilterStrategy = (posts: Post[], criteria: PostFilterCriteria) => Post[];

export const filterByTag: PostFilterStrategy = (posts, { tagFilter = '' }) => {
  if (!tagFilter) return posts;
  return posts.filter((post) => post.tags?.some((tag) => tag.name === tagFilter) === true);
};

export const filterByText: PostFilterStrategy = (posts, { textFilter = '' }) => {
  const normalizedQuery = textFilter.trim().toLowerCase();
  if (!normalizedQuery) return posts;

  return posts.filter(
    (post) =>
      post.titulo.toLowerCase().includes(normalizedQuery) ||
      post.description.toLowerCase().includes(normalizedQuery),
  );
};

export const filterByUser: PostFilterStrategy = (posts, { userId = null }) => {
  if (userId === null) return posts;
  return posts.filter((post) => post.user_id === userId);
};

export const filterByDateRange: PostFilterStrategy = (posts, { dateFrom = '', dateTo = '' }) => {
  const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
  const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

  if (!fromDate && !toDate) return posts;

  return posts.filter((post) => {
    const postDate = post.createdAt ? new Date(post.createdAt) : null;
    const matchesFrom = !fromDate || (postDate !== null && postDate >= fromDate);
    const matchesTo = !toDate || (postDate !== null && postDate <= toDate);
    return matchesFrom && matchesTo;
  });
};

export const POST_FILTER_STRATEGIES: PostFilterStrategy[] = [
  filterByTag,
  filterByText,
  filterByUser,
  filterByDateRange,
];
