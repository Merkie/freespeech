import React from "react";
import { Header as RneHeader } from 'react-native-elements';

export default class Header extends React.Component {
    render(){

        let icon = "menu";
        let navigateTo = "Menu";
        if(this.props.back){
            icon = "arrow-back";
            navigateTo = "Home";
        }

        return (
            <RneHeader
                leftComponent={{ icon: icon, color: '#fff', onPress: () => { this.props.navigation.navigate(navigateTo) } }}
                centerComponent={{ text: 'Free Speech', style: { color: '#fff' } }}
            />
        );
    }
}