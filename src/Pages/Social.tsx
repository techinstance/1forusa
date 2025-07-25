import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, FlatList } from 'react-native';
import { RootStackParamList } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FloatingActionButton from '../components/FloatingActionButton';
import Footer from '../components/Footer';
import PostComponent from '../SocialPost/PostComponent';
import PostCreationModal from '../SocialPost/PostCreationModal';
import PostEditModal from '../SocialPost/PostEditModal';
import type { Asset } from 'react-native-image-picker';
import type { Post, PostActions } from '../types/post';

type SocialProps = NativeStackScreenProps<RootStackParamList, 'Social'>;

const Social = ({ navigation }: SocialProps) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);

  const [posts, setPosts] = React.useState<Post[]>([
    {
      id: '1',
      text: "Welcome to our social platform! 🎉 Share your thoughts, connect with friends, and explore amazing content. What's on your mind today?",
      attachments: [],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      author: {
        name: 'Community Team',
        avatar: undefined,
      },
      likes: 24,
      comments: 8,
      isLiked: false,
    },
    {
      id: '2',
      text: 'Just finished building this amazing React Native app! The development experience has been incredible. 💻✨',
      attachments: [],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      author: {
        name: 'React Developer',
        avatar: undefined,
      },
      likes: 42,
      comments: 12,
      isLiked: true,
    },
    {
      id: '3',
      text: 'Beautiful sunset today! 🌅 Nature never fails to amaze me.',
      attachments: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      author: {
        name: 'Nature Lover',
        avatar: undefined,
      },
      likes: 18,
      comments: 3,
      isLiked: false,
    },
  ]);

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

      <Footer />

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
