export interface UserReview {
  id: string;
  movieId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // Scale 1 - 10
  title: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isSpoiler?: boolean;
  isVerifiedBuyer?: boolean;
}

export type ReviewSortOption = 'newest' | 'highest_rating' | 'lowest_rating';
