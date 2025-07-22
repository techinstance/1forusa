import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { Asset } from 'react-native-image-picker';
import { Post, PostActions } from '../types/post';

const { width: screenWidth } = Dimensions.get('window');

interface PostComponentProps {
  post: Post;
  actions: PostActions;
}

const PostComponent: React.FC<PostComponentProps> = ({ post, actions }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleDeletePress = useCallback(() => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => actions.onDelete(post.id),
        },
      ]
    );
  }, [actions, post.id]);

  const handleLikePress = useCallback(() => {
    actions.onLike(post.id);
  }, [actions, post.id]);

  const handleCommentPress = useCallback(() => {
    actions.onComment(post.id);
  }, [actions, post.id]);

  const handleEditPress = useCallback(() => {
    actions.onEdit(post);
  }, [actions, post]);

  const renderAttachment = useCallback(({ item }: { item: Asset }) => (
    <View style={styles.attachmentContainer}>
      <Image source={{ uri: item.uri }} style={styles.attachmentImage} />
    </View>
  ), []);

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          {post.author.avatar ? (
            <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {post.author.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.author.name}</Text>
            <Text style={styles.postTime}>
              {formatDate(post.createdAt)}
              {post.updatedAt && post.updatedAt > post.createdAt && (
                <Text style={styles.editedText}> • Edited</Text>
              )}
            </Text>
          </View>
        </View>
        <View style={styles.postActions}>
          <TouchableOpacity onPress={handleEditPress} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeletePress} style={styles.actionButton}>
            <Text style={[styles.actionButtonText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {post.text ? (
        <Text style={styles.postText}>{post.text}</Text>
      ) : null}

      {/* Attachments */}
      {post.attachments.length > 0 && (
        <FlatList
          data={post.attachments}
          renderItem={renderAttachment}
          keyExtractor={(item) => item.uri!}
          numColumns={post.attachments.length === 1 ? 1 : 2}
          columnWrapperStyle={post.attachments.length > 1 ? styles.attachmentRow : undefined}
          contentContainerStyle={styles.attachmentsList}
          scrollEnabled={false}
        />
      )}

      {/* Footer */}
      <View style={styles.postFooter}>
        <TouchableOpacity onPress={handleLikePress} style={styles.footerButton}>
          <Text style={[styles.footerButtonText, post.isLiked && styles.likedText]}>
            {post.isLiked ? '❤️' : '🤍'} {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCommentPress} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>💬 {post.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DA1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
  },
  postTime: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  editedText: {
    fontStyle: 'italic',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#1DA1F2',
    fontWeight: '500',
  },
  deleteText: {
    color: '#E0245E',
  },
  postText: {
    fontSize: 16,
    color: '#14171A',
    lineHeight: 22,
    marginBottom: 12,
  },
  attachmentsList: {
    marginBottom: 12,
  },
  attachmentRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  attachmentContainer: {
    width: (screenWidth - 32 - 8) / 2,
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F7F9FA',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    paddingTop: 8,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  likedText: {
    color: '#E0245E',
  },
});

export default PostComponent;
