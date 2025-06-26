import React from 'react';
import Slider from '@react-native-community/slider';

const slider = ()=>{
    
    

    return (
        <view>
            <view>
        
            </view>
            <Slider
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#FF0000"
            />
        </view>
    )
}
export default slider;
