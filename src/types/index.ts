export interface User {
  id: number;
  nickname: string;
  name: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  profilePicture?: string | null;
  isProfilePublic?: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostImage {
  id: number;
  url: string;
  post_id: number;
}

export interface Comment {
  id: number;
  content: string;
  user_id?: number;
  post_id?: number;
  createdAt?: string;
  user?: Pick<User, 'id' | 'nickname' | 'name' | 'lastName' | 'profilePicture'>;
}

export interface Post {
  id: number;
  slug: string;
  titulo: string;
  description: string;
  user_id: number;
  user?: Pick<User, 'id' | 'nickname' | 'name' | 'lastName' | 'profilePicture'>;
  tags?: Tag[];
  postImages?: PostImage[];
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedPosts {
  items: Post[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
}

export interface CreateUserPayload {
  nickname: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
}

export interface UpdateUserPayload {
  nickname: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  isProfilePublic?: boolean;
}

export interface CreatePostPayload {
  titulo: string;
  description: string;
  user_id: number;
  tags?: string[];
}

export interface CreateCommentPayload {
  content: string;
  post_id: number;
  user_id: number;
}

export interface UpdatePostPayload {
  titulo?: string;
  description?: string;
  tags?: string[];
}

export type UserPublic = Pick<User, 'id' | 'nickname' | 'name' | 'lastName' | 'profilePicture' | 'isProfilePublic'>;

export interface UserLimitedPublic {
  id: number;
  nickname: string;
  isProfilePublic: false;
}

export type FollowUserSummary = Pick<User, 'id' | 'nickname' | 'name' | 'lastName' | 'profilePicture'>;
