import { SafeAreaView, Text, View } from "react-native"
import { StyleSheet } from "react-native";
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type SocailProps = NativeStackScreenProps<RootStackParamList, 'Socail'>;
const Socail = () =>{
    return (
        <SafeAreaView>
            <View>
                <Text>Socials</Text>
            </View>
        </SafeAreaView>
    )
}
export default Socail;
const styles = StyleSheet.create({

});