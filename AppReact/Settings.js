import * as React from 'react';
import { View, Text, Image, Button, BackHandler, StyleSheet } from 'react-native';
import axios from 'axios'


export default class SettingsScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {                                          // COLOCAR CONFIGURAÇOES AQUI
            Axios: axios.create({
                urlAPI: props.state.urlAPI        //* IP DO EMBARCADO?
            }),
        }
    }
    
    async getConfig() {
        try {
            const response = await fetch(`${this.state.urlAPI}/sensor/configuracao`)
            sensibilidade = await response.json();
        } catch (error) {
            console.log(error)
        }

        if (sensibilidade) {
            this.setState({
                sensibilidade: sensibilidade
            })
        } else {
            this.setState({
                status: "Offline",
                sensibilidade: 0
            })
        }
    }

    async configurar() {
        try {
            const response = await fetch(`${this.state.urlAPI}/sensor/configuracao`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    sensibilidade: this.state.sensibilidade
                }
            })
        } catch (error) {
            console.log(error)
        }

        console.log(response) // if response == error { this.state.sensibilidade = "Offline"}
        // ou show status 
        // mostrar popup deu certo
    }

    render() {
        const { navigate } = this.props.navigation;
        const { sensibilidade } = this.state.sensibilidade || "Carregando"

        return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.text}>Status Embarcado: {status}</Text> 
                    <Text style={styles.text}>Sensibilidade: {sensibilidade}</Text>
                </View>
                <View style={styles.button}>
                    <Button title="Alterar Configuração" onPress={() => this.configurar()} />
                </View>
                <View style={styles.button}>
                    <Button title="Ver Historico de Configurações?" onPress={async () => navigate('HistoricoLeituras', { lista: await this.getHistorico() })} />
                </View>
                <View style={styles.button}>
                    <Button title="Voltar" onPress={() => navigate('Info')} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});