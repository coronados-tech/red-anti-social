import type { Post } from '../types';
import { POST_FILTER_STRATEGIES, type PostFilterCriteria } from './postFilterStrategies';

export type { PostFilterCriteria };

export function extractTagsFromPosts(posts: Post[]): string[] {
  return Array.from(
    new Set(posts.flatMap((post) => post.tags?.map((tag) => tag.name) ?? [])),
  ).sort();
}

export function filterPosts(posts: Post[], criteria: PostFilterCriteria): Post[] {
  return POST_FILTER_STRATEGIES.reduce(
    (filtered, strategy) => strategy(filtered, criteria),
    posts,
  );
}
