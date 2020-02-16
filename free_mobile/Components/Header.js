import React from "react";
import { Header as RneHeader } from 'react-native-elements';

export default class Header extends React.Component {
    render(){
        if(this.props.back){
            return (
                <RneHeader
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => { this.props.navigation.navigate('Home') } }}
                    centerComponent={{ text: 'Free Speech', style: { color: '#fff' } }}
                />
            );
        } else {
            return (
                <RneHeader
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => { this.props.navigation.navigate('Menu') } }}
                    centerComponent={{ text: 'Free Speech', style: { color: '#fff' } }}
                />
            );
        }
    }
}