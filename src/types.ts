export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'student';
  likedPosts?: string[];
  points: number;
  dailyActivity: Record<string, number>; // date string (YYYY-MM-DD) -> activity count
  bio?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  createdAt: any;
  updatedAt: any;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  isAnonymous: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}

