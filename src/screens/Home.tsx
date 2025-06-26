import { View,Text , StyleSheet} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Footer from "../components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";


type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
const Home = ({navigation} : HomeProps) =>{
    return (
        <SafeAreaView style={styles.container}>
            {/* <GlobalQuesitions/> */}
            <View>
              <Slider/>
            </View>
            <Footer/>
        </SafeAreaView>
    )
}
export default Home;

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : "center",
        justifyContent : "center"
    }
});