import { Link } from "@react-navigation/native"
import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome";
const Footer = () => {
    return (
        <View>
            <Link screen="Home" params={{}} >
                <Icon name="Home" size={24} color="black" />
                <Text>Home</Text>
            </Link>
            <Link screen="Socail" params={{}} >
                <Icon name="Socail" size={24} color="black" />
                <Text>Socail</Text>
            </Link>
            <Link screen="Activites" params={{}} >
                <Icon name="Activites" size={24} color="black" />
                <Text>Activites</Text>
            </Link>
            <Link screen="Profile" params={{}} >
                <Icon name="Profile" size={24} color="black" />
                <Text>Profile</Text>
            </Link>
        </View>
    )
}
export default Footer;

const styles = StyleSheet.create({

})