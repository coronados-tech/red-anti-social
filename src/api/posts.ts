import type { Post, Tag, CreatePostPayload, PostImage, UpdatePostPayload } from "../types";
import { API_URL, requestJson } from "./client";

export async function getPosts(userId?: number, viewerId?: number): Promise<Post[]> {
    let url = `${API_URL}/posts`;
    const params: string[] = [];
    if (userId !== undefined) params.push(`user_id=${userId}`);
    if (viewerId !== undefined) params.push(`viewer_id=${viewerId}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    return requestJson<Post[]>(url);
}

export async function getPostById(id: number, viewerId?: number): Promise<Post> {
  const url = viewerId !== undefined 
    ? `${API_URL}/posts/${id}?viewer_id=${viewerId}` 
    : `${API_URL}/posts/${id}`;

  return requestJson<Post>(url);
}

export async function getTags(): Promise<Tag[]> {
    return requestJson<Tag[]>(`${API_URL}/tags`);
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
    return requestJson<Post>(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
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

export async function updatePost(id: number, payload: UpdatePostPayload): Promise<Post> {
  return requestJson<Post>(`${API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(payload),
  });
}

export async function deletePost(id: number): Promise<void> {
  return requestJson<void>(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
  });
}