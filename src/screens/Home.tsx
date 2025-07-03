import { View, StyleSheet, FlatList, Text} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Footer from "../components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingActionButton from "../components/FloatingActionButton";
import PostCreationModal from "../components/PostCreationModal";
import PostEditModal from "../components/PostEditModal";
import PostComponent from "../components/PostComponent";
import React from "react";
import { Asset } from "react-native-image-picker";
import { Post, PostActions } from "../types/post";

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>

const Home = ({navigation: _navigation} : HomeProps) =>{
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [editingPost, setEditingPost] = React.useState<Post | null>(null);
    const [posts, setPosts] = React.useState<Post[]>([
        {
            id: '1',
            text: 'Welcome to our social platform! 🎉 Share your thoughts, connect with friends, and explore amazing content. What\'s on your mind today?',
            attachments: [],
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
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
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
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
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
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

        setPosts(prevPosts => [newPost, ...prevPosts]);
        setIsModalVisible(false);
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setIsEditModalVisible(true);
    };

    const handleSaveEdit = (postId: string, text: string, attachments: Asset[]) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, text, attachments, updatedAt: new Date() }
                    : post
            )
        );
        setIsEditModalVisible(false);
        setEditingPost(null);
    };

    const handleDeletePost = (postId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    };

    const handleLikePost = (postId: string) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                          ...post,
                          isLiked: !post.isLiked,
                          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                      }
                    : post
            )
        );
    };

    const handleCommentPost = (postId: string) => {
        // TODO: Implement comment functionality
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
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                style={styles.postsList}
                contentContainerStyle={posts.length === 0 ? styles.emptyContainer : undefined}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
            <FloatingActionButton onPress={handleCreatePost} />
            <Footer/>
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
    )
}

export default Home;

const styles = StyleSheet.create({
    container : {
        flex : 1,
        position: 'relative',
        backgroundColor: '#F7F9FA',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8ED',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#14171A',
    },
    postsList: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#14171A',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 20,
    },
});