import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type ActivitesProps = NativeStackScreenProps<RootStackParamList, 'Activites'>;
const Activites = () => {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Activities Screen</Text>
        </SafeAreaView>
    );
}
export default Activites;
const styles = StyleSheet.create({

});