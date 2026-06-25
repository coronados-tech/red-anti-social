export {
  API_URL,
  ApiRequestError,
  getAuthToken,
  setAuthToken,
  setOnUnauthorized,
} from "./client";

export { getPosts, getTags } from "./posts";
export {
  loginUser,
  getCurrentUser,
  getUsers,
  getUserById,
  updateUser,
  uploadProfilePicture,
  deleteProfilePicture,
  createUser,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser,
} from "./users";
