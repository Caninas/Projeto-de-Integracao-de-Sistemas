import * as React from 'react';
import { View, Text, Image, Button, BackHandler, StyleSheet } from 'react-native';
import axios from 'axios'


export default class SettingsScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {                                          // COLOCAR CONFIGURAÇOES AQUI
            Axios: axios.create({
                baseURL: 'http://192.168.0.25:8000/'        //* IP DO EMBARCADO?
            }),
        }
    }
    
    render() {
        const { navigate } = this.props.navigation;

        return (
            <View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({

});