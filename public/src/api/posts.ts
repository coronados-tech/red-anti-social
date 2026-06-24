import type { Post, Tag } from "../types";
import { API_URL, requestJson } from "./client";

export async function getPosts(userId?: number, viewerId?: number): Promise<Post[]> {
    let url = `${API_URL}/posts`;
    const params: string[] = [];
    if (userId !== undefined) params.push(`user_id=${userId}`);
    if (viewerId !== undefined) params.push(`viewer_id=${viewerId}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    return requestJson<Post[]>(url);
}

export async function getTags(): Promise<Tag[]> {
    return requestJson<Tag[]>(`${API_URL}/tags`);
}
