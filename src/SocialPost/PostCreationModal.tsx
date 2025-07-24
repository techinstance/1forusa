import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';

const { width: screenWidth } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  Social: undefined;
  Activites: undefined;
  Profile: undefined;
};

interface PostCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onPost: (text: string, attachments: Asset[]) => void;
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({
  visible,
  onClose,
  onPost,
}) => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const [postText, setPostText] = React.useState('');
  const [attachments, setAttachments] = React.useState<Asset[]>([]);
  const [shouldRender, setShouldRender] = React.useState(visible);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Handle hardware back button when modal is visible
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (visible) {
          // Navigate to Home screen instead of just closing modal
          setPostText('');
          setAttachments([]);
          onClose();
          navigation.navigate('Home');
          return true; // Prevent default back action
        }
        return false; // Let default back action happen
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [visible, navigation, onClose])
  );

  useEffect(() => {
    if (visible) {
      // Show the component first, then animate
      setShouldRender(true);
      // Reset to starting position
      slideAnim.setValue(screenWidth);
      // Small delay to ensure component is mounted before animation
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }, 50);
      
      return () => clearTimeout(timer);
    } else if (shouldRender) {
      // Slide out to right, then hide component
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 100,
        useNativeDriver: true,
      }).start((finished) => {
        if (finished) {
          setShouldRender(false);
        }
      });
    }
  }, [visible, slideAnim, shouldRender]);

  const handleChoosePhoto = () => {
    if (attachments.length >= 4) {
      // Optionally, show an alert to the user
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: 4 - attachments.length,
        quality: 1,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
          setAttachments([...attachments, ...response.assets]);
        }
      },
    );
  };

  const removeAttachment = useCallback((uri: string) => {
    setAttachments(prevAttachments => prevAttachments.filter((item) => item.uri !== uri));
  }, []);

  const renderAttachment = useCallback(({ item }: { item: Asset }) => (
    <View style={styles.attachmentContainer}>
      <Image source={{ uri: item.uri }} style={styles.attachmentPreview} />
      <TouchableOpacity onPress={() => removeAttachment(item.uri!)} style={styles.removeAttachmentButton}>
        <Text style={styles.removeAttachmentText}>✕</Text>
      </TouchableOpacity>
    </View>
  ), [removeAttachment]);

  const handlePost = () => {
    if (postText.trim() || attachments.length > 0) {
      onPost(postText.trim(), attachments);
      setPostText('');
      setAttachments([]);
      onClose();
      // Ensure we're on Home screen after posting
      navigation.navigate('Home');
    }
  };

  const handleClose = () => {
    setPostText('');
    setAttachments([]);
    onClose();
    // Navigate to Home screen when closing
    navigation.navigate('Home');
  };

  if (!shouldRender) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Post</Text>
              <TouchableOpacity
                onPress={handlePost}
                style={[
                  styles.postButton,
                  !postText.trim() && attachments.length === 0 && styles.disabledButton,
                ]}
                disabled={!postText.trim() && attachments.length === 0}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <TextInput
                style={styles.textInput}
                placeholder="Text to Write"
                placeholderTextColor="#8E8E93"
                multiline
                value={postText}
                onChangeText={setPostText}
                autoFocus
                maxLength={280}
              />

              {attachments.length > 0 && (
                <FlatList
                  data={attachments}
                  renderItem={renderAttachment}
                  keyExtractor={(item) => item.uri!}
                  numColumns={2}
                  columnWrapperStyle={styles.attachmentRow}
                  contentContainerStyle={styles.attachmentsList}
                  scrollEnabled={false}
                />
              )}
              
              {/* Character count */}
              <View style={styles.footer}>
                <TouchableOpacity onPress={handleChoosePhoto} style={styles.attachmentButton}>
                  <Text style={styles.attachmentButtonText}>Add Media</Text>
                </TouchableOpacity>
                <Text style={styles.characterCount}>
                  {postText.length}/280
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: screenWidth,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  closeButton: {
    padding: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#1DA1F2',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14171A',
  },
  postButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 2, // Give more space to text input
    fontSize: 18,
    color: '#14171A',
    textAlignVertical: 'top',
    paddingTop: 16,
    paddingBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  characterCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  attachmentButton: {
    padding: 8,
  },
  attachmentButtonText: {
    fontSize: 16,
    color: '#1DA1F2',
    fontWeight: '600',
  },
  attachmentsList: {
    paddingVertical: 8,
    marginTop: 16, // Pushes the image grid down
  },
  attachmentRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  attachmentContainer: {
    width: (screenWidth - 32 - 8) / 2, // screen - (2 * h-padding) - gap
    aspectRatio: 1,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#F7F9FA',
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeAttachmentText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PostCreationModal;
