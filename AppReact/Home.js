
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { LogoTitle, Button, Image } from 'react-native';

import InfoScreen from './Info'
import SettingsScreen from './Settings'

const Tab = createMaterialTopTabNavigator();

export default class HomeScreen extends React.Component  {
    static navigationOptions = {       
        title: "Projeto Final",
    }

    constructor(props) {
      super(props)
      this.state = {
        urlAPI: 'http://192.168.0.25:8000',
      }
    }

    render() {
        return (
            <NavigationContainer>
              <Tab.Navigator>
                <Tab.Screen name="Info" children={() => <InfoScreen navigation={this.props.navigation} state={this.state} />}  />
                <Tab.Screen name="Configurações" children={() => <SettingsScreen navigation={this.props.navigation} state={this.state} />} />
              </Tab.Navigator>
            </NavigationContainer>
          );
    }

}