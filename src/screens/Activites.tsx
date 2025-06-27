import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/Footer';

type ActivitesProps = NativeStackScreenProps<RootStackParamList, 'Activites'>;
const Activites = ({navigation: _navigation}: ActivitesProps) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Activities</Text>
            </View>
            <Footer/>
        </SafeAreaView>
    );
}
export default Activites;

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