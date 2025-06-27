import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Footer from "../components/Footer";

type SocialProps = NativeStackScreenProps<RootStackParamList, 'Social'>;
const Social = ({navigation: _navigation}: SocialProps) =>{
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Social</Text>
            </View>
            <Footer/>
        </SafeAreaView>
    )
}
export default Social;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    }
});