import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Components
import Home from "./Components/Home";
import Menu from "./Components/Menu";

//Reducers
import VoiceReducer from "./Reducers/VoiceReducer";

// Stack
const store = createStore(VoiceReducer);
const Stack = createStackNavigator();

export default class App extends React.Component {
    render(){
        return (
            <Provider store={store}>
                <ThemeProvider>
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false
                            }}
                        >
                            <Stack.Screen name="Home" component={Home} />
                            <Stack.Screen name="Menu" component={Menu} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </ThemeProvider>
            </Provider>
        );
    }
}