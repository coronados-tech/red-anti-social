import type { Post } from "../types";

interface FilterOptions {
  tagFilter: string;
  textFilter: string;
  dateFrom: string;
  dateTo: string;
  userId: number | null;
}

export function extractTagsFromPosts(posts: Post[]): string[] {
  const tagsSet = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagsSet.add(tag.name);
    });
  });
  return Array.from(tagsSet).sort();
}

export function filterPosts(posts: Post[], options: FilterOptions): Post[] {
  return posts.filter((post) => {
    // Filter by text
    if (options.textFilter.trim()) {
      const text = options.textFilter.toLowerCase();
      const matchesText =
        post.titulo.toLowerCase().includes(text) ||
        post.description.toLowerCase().includes(text);
      if (!matchesText) return false;
    }

    // Filter by tag
    if (options.tagFilter) {
      const hasTag = post.tags?.some((tag) => tag.name === options.tagFilter);
      if (!hasTag) return false;
    }

    // Filter by date range
    if (options.dateFrom || options.dateTo) {
      const postDate = post.createdAt ? new Date(post.createdAt) : null;
      if (postDate) {
        if (options.dateFrom) {
          const from = new Date(options.dateFrom);
          if (postDate < from) return false;
        }
        if (options.dateTo) {
          const to = new Date(options.dateTo);
          if (postDate > to) return false;
        }
      }
    }

    // Filter by user
    if (options.userId) {
      if (post.user_id !== options.userId) return false;
    }

    return true;
  });
}
