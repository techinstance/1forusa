import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, FlatList } from 'react-native';
import { RootStackParamList } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FloatingActionButton from '../components/FloatingActionButton';
import PostComponent from '../SocialPost/PostComponent';
import PostCreationModal from '../SocialPost/PostCreationModal';
import PostEditModal from '../SocialPost/PostEditModal';
import type { Asset } from 'react-native-image-picker';
import type { Post, PostActions } from '../types/post';
import { fetchSocialPosts } from '../Services/socialServices';
import { useEffect, useState } from 'react';
type SocialProps = NativeStackScreenProps<RootStackParamList, 'Social'>;

const Social = ({}: SocialProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  // Transform API response to match Post interface
  const transformApiPostToPost = (apiPost: any): Post => {
    // Transform images from API to attachments format
    const attachments = [];
    if (apiPost.image) {
      // Single image
      attachments.push({
        uri: apiPost.image,
        type: 'image/jpeg',
        fileName: 'post_image.jpg',
      });
    } else if (apiPost.images && Array.isArray(apiPost.images)) {
      // Multiple images
      apiPost.images.forEach((imageUrl: string, index: number) => {
        attachments.push({
          uri: imageUrl,
          type: 'image/jpeg',
          fileName: `post_image_${index}.jpg`,
        });
      });
    } else if (apiPost.attachments && Array.isArray(apiPost.attachments)) {
      // If API already has attachments in some format
      apiPost.attachments.forEach((attachment: any, index: number) => {
        attachments.push({
          uri: attachment.url || attachment.uri || attachment,
          type: attachment.type || 'image/jpeg',
          fileName: attachment.fileName || `attachment_${index}.jpg`,
        });
      });
    }

    return {
      id: apiPost._id,
      text: apiPost.text,
      attachments: attachments,
      createdAt: new Date(apiPost.createdAt),
      author: {
        name: apiPost.user?.name || 'Anonymous',
        avatar:
          apiPost.user?.avatar || apiPost.user?.profilePicture || undefined,
      },
      likes: apiPost.likes?.length || 0,
      comments: apiPost.comments?.length || 0,
      isLiked: false, // We'd need user info to determine this
    };
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // setLoading(true);
        // setError(null);
        const data = await fetchSocialPosts();
        console.log('Raw API data:', data);

        // Transform the API data to match our Post interface
        const transformedPosts = data.map(transformApiPostToPost);
        console.log('Transformed posts:', transformedPosts);

        // Log image information for debugging
        transformedPosts.forEach((post: Post, index: number) => {
          if (post.attachments.length > 0) {
            console.log(
              `Post ${index} has ${post.attachments.length} images:`,
              post.attachments,
            );
          }
        });

        setPosts(transformedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        // setError('Failed to load posts. Please try again.');
      } finally {
        // setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleCreatePost = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handlePost = (text: string, attachments: Asset[]) => {
    const newPost: Post = {
      id: Date.now().toString(),
      text,
      attachments,
      createdAt: new Date(),
      author: {
        name: 'You',
        avatar: undefined,
      },
      likes: 0,
      comments: 0,
      isLiked: false,
    };

    setPosts(prev => [newPost, ...prev]);
    setIsModalVisible(false);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = (
    postId: string,
    text: string,
    attachments: Asset[],
  ) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, text, attachments, updatedAt: new Date() }
          : p,
      ),
    );
    setIsEditModalVisible(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const handleCommentPost = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const postActions: PostActions = {
    onEdit: handleEditPost,
    onDelete: handleDeletePost,
    onLike: handleLikePost,
    onComment: handleCommentPost,
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostComponent post={item} actions={postActions} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No posts yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Tap the + button to create your first post!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          style={styles.postsList}
          contentContainerStyle={
            posts.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FloatingActionButton onPress={handleCreatePost} />

      <PostCreationModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onPost={handlePost}
      />

      <PostEditModal
        visible={isEditModalVisible}
        post={editingPost}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingPost(null);
        }}
        onSave={handleSaveEdit}
      />
    </SafeAreaView>
  );
};

export default Social;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1, // This makes FlatList take all space above Footer
  },
  postsList: {
    flex: 1,
    padding: 10,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
  },
});
