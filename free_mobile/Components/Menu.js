import React from "react";
import {ScrollView, View, Text} from "react-native";
import Header from "./Header";
import * as Speech from "expo-speech";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { ListItem } from "react-native-elements";

import { setVoices, setUsedVoice } from '../Reducers/VoiceReducer';

class Menu extends React.Component {

    async componentDidMount(){
        let voices = await Speech.getAvailableVoicesAsync();
        this.props.setVoices(voices);
    }

    render(){
        return (
            <View>
                <Header
                    navigation={this.props.navigation}
                    back={true}
                />
                <ScrollView>
                {
                    this.props.voices.available_voices.map((l, i) => {
                        return (
                            <ListItem
                                key={i}
                                title={l.name}
                                subtitle={l.language}
                                onPress={() => {
                                    this.props.setUsedVoice(l.identifier);
                                    this.props.navigation.navigate("Home");
                                }}
                                bottomDivider
                            />
                        )
                    })
                }
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { voices } = state;
    return { voices };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setVoices,
        setUsedVoice
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);