import React from "react";
import {ListItem} from "react-native-elements";
import {ScrollView, View} from "react-native";
import Header from "./Header";
import build from "../build";
import * as Speech from "expo-speech";
import {connect} from "react-redux";

class Home extends React.Component {

    speakText(text){
        Speech.speak(text, { voice: this.props.voices.used_voice })
    }

    render(){
        return (
            <View>
                <Header
                    navigation={this.props.navigation}
                />
                <ScrollView>
                    {
                        build.page.map((l, i) => (
                            <ListItem
                                key={i}
                                leftAvatar={{ source: { uri: l.image } }}
                                title={l.name}
                                subtitle={l.text}
                                onPress={() => {
                                    this.speakText(l.name)
                                }}
                                bottomDivider
                            />
                        ))
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

export default connect(mapStateToProps)(Home);