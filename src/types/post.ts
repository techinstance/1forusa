import { Asset } from 'react-native-image-picker';

export interface Post {
  id: string;
  text: string;
  attachments: Asset[];
  createdAt: Date;
  updatedAt?: Date;
  author: {
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
}

export interface PostActions {
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (post: Post) => void;
}
