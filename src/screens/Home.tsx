import { View, StyleSheet} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Footer from "../components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import FloatingActionButton from "../components/FloatingActionButton";


type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
const Home = ({navigation: _navigation} : HomeProps) =>{
    const handleCreatePost = () => {
        // TODO: Navigate to post creation screen or open modal
        console.log('Create post pressed');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View>
                  <Slider/>
                </View>
            </View>
            <FloatingActionButton onPress={handleCreatePost} />
            <Footer/>
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