import { View, StyleSheet} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Footer from "../components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingActionButton from "../components/FloatingActionButton";
import PostCreationModal from "../components/PostCreationModal";
import React from "react";


type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
const Home = ({navigation: _navigation} : HomeProps) =>{
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const handleCreatePost = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handlePost = (text: string) => {
        // TODO: Handle post submission here
        console.log('Post created:', text);
        // You can add your post submission logic here
        setIsModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Main content area - content here */}
            </View>
            <FloatingActionButton onPress={handleCreatePost} />
            <Footer/>
            <PostCreationModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                onPost={handlePost}
            />
        </SafeAreaView>
    )
}
export default Home;

const styles = StyleSheet.create({
    container : {
        flex : 1,
        position: 'relative', // Enable positioning context for absolute children
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});