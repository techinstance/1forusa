import React, { useState, useRef, use, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NavigationProp } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';
import { getUserProfile } from '../Services/authServices';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Social: undefined;
  Activities: undefined;
  Profile: undefined;
  TileGrid: undefined;
};

interface BurgerHeaderProps {
  title?: string;
  showBack?: boolean;
}

interface MenuItem {
  name: keyof RootStackParamList;
  icon: string;
  label: string;
  badge?: number;
}

const BurgerHeader: React.FC<BurgerHeaderProps> = ({
  title = 'Wellness App',
  showBack = false,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const defaultAvatar =
    'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const [userData, setUserData] = useState({
    name: 'Loading...',
    phone: 'Loading...',
    avatar: defaultAvatar,
  });
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  const userFun = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Fetched user ID:', userId);

      if (userId) {
        const userProfile = await getUserProfile(userId);
        console.log('Fetched user data:', userProfile);

        // Handle different response structures
        let profileData;
        if (userProfile.user) {
          profileData = userProfile.user;
        } else if (userProfile.data && userProfile.data.user) {
          profileData = userProfile.data.user;
        } else if (userProfile.data) {
          profileData = userProfile.data;
        } else {
          profileData = userProfile;
        }

        setUserData({
          name: profileData.name || profileData.fullName || 'User',
          phone: profileData.phone || profileData.phoneNumber || 'N/A',
          avatar:
            profileData.avatar || profileData.profileImage || defaultAvatar,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({
        name: 'Guest User',
        phone: 'N/A',
        avatar: defaultAvatar,
      });
    }
  }, [defaultAvatar]);
  useEffect(() => {
    userFun();
  }, [userFun]);

  const menuItems: MenuItem[] = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Social', icon: 'users', label: 'Social Media', badge: 3 },
    { name: 'Activities', icon: 'calendar', label: 'Activities' },
    { name: 'TileGrid', icon: 'th', label: 'Wellness Journey' },
    { name: 'Profile', icon: 'user', label: 'Profile' },
  ];

  const openMenu = () => {
    console.log('Opening burger menu...');
    setIsMenuVisible(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40, // Increased tension for faster animation
        friction: 95, // Increased friction for less bounce
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('Menu animation completed');
    });
  };

  const closeMenu = () => {
    console.log('Closing burger menu...');
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 150, // Reduced from 250ms to 150ms
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 150, // Reduced from 250ms to 150ms
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('Menu close animation completed');
      setIsMenuVisible(false);
    });
  };

  const handleMenuItemPress = (screenName: keyof RootStackParamList) => {
    closeMenu();
    setTimeout(() => {
      if (route.name !== screenName) {
        navigation.navigate(screenName);
      }
    }, 250);
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.iconButton}
            >
              <Icon name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                console.log('Burger menu button pressed');
                openMenu();
              }}
              style={styles.iconButton}
            >
              <Icon name="bars" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          {/* Test button - remove this after testing */}
        </View>
      </View>

      {/* Burger Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          {/* Animated backdrop with blur effect */}
          <Animated.View
            style={[
              styles.animatedBackdrop,
              styles.darkBackdrop,
              { opacity: backgroundOpacity },
            ]}
          />

          {/* Clickable overlay to close menu */}
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={closeMenu}
          />

          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <SafeAreaView style={styles.menuContent}>
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: userData.avatar }}
                  style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{userData.name}</Text>
                  <Text style={styles.profilePhone}>{userData.phone}</Text>
                </View>
                <TouchableOpacity style={styles.nightModeButton}>
                  <Icon name="moon-o" size={18} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Menu Items */}
              <ScrollView style={styles.menuItems}>
                {menuItems.map(item => {
                  const isActive = route.name === item.name;

                  return (
                    <TouchableOpacity
                      key={item.name}
                      style={[
                        styles.menuItem,
                        isActive && styles.activeMenuItem,
                      ]}
                      onPress={() => handleMenuItemPress(item.name)}
                    >
                      <View style={styles.menuItemContent}>
                        <Icon
                          name={item.icon}
                          size={20}
                          color={isActive ? '#007AFF' : '#333333'}
                          style={styles.menuItemIcon}
                        />
                        <Text
                          style={[
                            styles.menuItemText,
                            isActive && styles.activeMenuItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                      {item.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Menu Footer */}
              <View style={styles.menuFooter}>
                <TouchableOpacity style={styles.menuItem}>
                  <View style={styles.menuItemContent}>
                    <Icon
                      name="cog"
                      size={20}
                      color="#333333"
                      style={styles.menuItemIcon}
                    />
                    <Text style={styles.menuItemText}>Settings</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <View style={styles.menuItemContent}>
                    <Icon
                      name="question-circle"
                      size={20}
                      color="#333333"
                      style={styles.menuItemIcon}
                    />
                    <Text style={styles.menuItemText}>Help & FAQ</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Account for status bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  leftSection: {
    width: 40,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  testButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  fallbackBlur: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  animatedBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  darkBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuContent: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#8E8E93',
  },
  nightModeButton: {
    padding: 8,
  },
  menuItems: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  activeMenuItem: {
    backgroundColor: '#E3F2FD',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    marginRight: 15,
    width: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  activeMenuItemText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  menuFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    paddingVertical: 10,
  },
});

export default BurgerHeader;
