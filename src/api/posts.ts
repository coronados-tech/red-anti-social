import type {
  Comment,
  CreateCommentPayload,
  CreatePostPayload,
  PaginatedPosts,
  Post,
  PostImage,
  PostLikeResponse,
  Tag,
  UpdatePostPayload,
} from '../types';
import { API_URL, requestEmpty, requestJson, withViewerId } from './client';

export const POSTS_PAGE_SIZE = 3;

export async function getPosts(userId?: number, viewerId?: number): Promise<Post[]> {
  let url = `${API_URL}/posts`;
  const params: string[] = [];
  if (userId !== undefined) params.push(`user_id=${userId}`);
  if (viewerId !== undefined) params.push(`viewer_id=${viewerId}`);
  if (params.length > 0) url += `?${params.join('&')}`;

  return requestJson<Post[]>(url);
}

export async function getPostsPage(
  page: number,
  limit: number = POSTS_PAGE_SIZE,
  viewerId?: number,
): Promise<PaginatedPosts> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (viewerId !== undefined) params.set('viewer_id', String(viewerId));

  const data = await requestJson<PaginatedPosts | Post[]>(
    `${API_URL}/posts?${params.toString()}`,
  );

  if (Array.isArray(data)) {
    const offset = (page - 1) * limit;
    const items = data.slice(offset, offset + limit);
    const total = data.length;
    return {
      items,
      page,
      limit,
      total,
      hasMore: offset + items.length < total,
    };
  }

  const items = data.items ?? [];
  const total = Number(data.total) || 0;
  const currentPage = Number(data.page) || page;
  const pageLimit = Number(data.limit) || limit;
  const offset = (currentPage - 1) * pageLimit;

  return {
    items,
    page: currentPage,
    limit: pageLimit,
    total,
    hasMore:
      typeof data.hasMore === 'boolean'
        ? data.hasMore
        : offset + items.length < total,
  };
}

export async function getPostById(id: number, viewerId?: number): Promise<Post> {
  return requestJson<Post>(withViewerId(`${API_URL}/posts/${id}`, viewerId));
}

export async function getPostBySlug(slug: string, viewerId?: number): Promise<Post> {
  const encodedSlug = encodeURIComponent(slug);
  return requestJson<Post>(withViewerId(`${API_URL}/posts/slug/${encodedSlug}`, viewerId));
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  return requestJson<Post>(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updatePost(id: number, payload: UpdatePostPayload): Promise<Post> {
  return requestJson<Post>(`${API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deletePost(id: number): Promise<void> {
  await requestEmpty(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
  });
}

export async function getTags(): Promise<Tag[]> {
  return requestJson<Tag[]>(`${API_URL}/tags`);
}

export async function getCommentsByPost(postId: number): Promise<Comment[]> {
  return requestJson<Comment[]>(`${API_URL}/comments?post_id=${postId}`);
}

export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
  return requestJson<Comment>(`${API_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function uploadPostImage(postId: number, file: File): Promise<PostImage> {
  const formData = new FormData();
  formData.append('image', file);

  return requestJson<PostImage>(`${API_URL}/posts/${postId}/images`, {
    method: 'POST',
    body: formData,
  });
}

export async function deletePostImage(postId: number, imageId: number): Promise<void> {
  await requestEmpty(`${API_URL}/posts/${postId}/images/${imageId}`, {
    method: 'DELETE',
  });
}

export async function likePost(postId: number): Promise<PostLikeResponse> {
  return requestJson<PostLikeResponse>(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
  });
}

export async function unlikePost(postId: number): Promise<PostLikeResponse> {
  return requestJson<PostLikeResponse>(`${API_URL}/posts/${postId}/like`, {
    method: 'DELETE',
  });
}
