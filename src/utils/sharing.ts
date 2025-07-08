import { Share, Alert } from 'react-native';
import { Post } from '../types/post';

export const generatePostShareContent = (post: Post) => {
  
  const deepLinkUrl = `forusa://post/${post.id}`;
  const webUrl = `https://forusa.app/post/${post.id}`;
  

  let previewText = '';
  if (post.text) {
    previewText = post.text.length > 100 
      ? `${post.text.substring(0, 100)}...` 
      : post.text;
  }
  
  let shareMessage = `Check out this post by ${post.author.name} on ForUSA:`;
  
  if (previewText) {
    shareMessage += `\n\n"${previewText}"`;
  }
  
  if (post.attachments.length > 0) {
    shareMessage += `\n📷 ${post.attachments.length} ${post.attachments.length === 1 ? 'photo' : 'photos'}`;
  }
  
  // Add engagement stats
  if (post.likes > 0 || post.comments > 0) {
    shareMessage += `\n❤️ ${post.likes} ${post.likes === 1 ? 'like' : 'likes'}`;
    if (post.comments > 0) {
      shareMessage += ` • 💬 ${post.comments} ${post.comments === 1 ? 'comment' : 'comments'}`;
    }
  }
  
  shareMessage += `\n\nOpen in app: ${deepLinkUrl}`;
  shareMessage += `\nView online: ${webUrl}`;
  
  return {
    message: shareMessage,
    url: webUrl,
    title: `Post by ${post.author.name} - ForUSA`,
  };
};

export const sharePost = async (post: Post, onSuccess?: (post: Post) => void) => {
  try {
    const shareContent = generatePostShareContent(post);
    const result = await Share.share(shareContent);
    
    if (result.action === Share.sharedAction && onSuccess) {
      onSuccess(post);
    }
    
    return result;
  } catch (error) {
    Alert.alert('Error', 'Unable to share this post');
    console.error('Share error:', error);
    throw error;
  }
};

export const generateDeepLink = (type: 'post' | 'user', id: string) => {
  return `forusa://${type}/${id}`;
};

export const generateWebLink = (type: 'post' | 'user', id: string) => {
  return `https://forusa.app/${type}/${id}`;
};
