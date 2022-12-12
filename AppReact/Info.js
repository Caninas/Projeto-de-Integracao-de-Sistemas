import * as React from 'react';
import { View, Text, Image, Button, BackHandler, StyleSheet } from 'react-native';
import axios from 'axios'

const wait = function (tempo) {
    return new Promise(resolve => setTimeout(resolve, tempo))
}

export default class InfoScreen extends React.Component {
    constructor(props) {
        super(props)
        this.atualizar = this.atualizar.bind(this)
        this.state = {
            botao_atualizaçao: "Parar Atualização",
            status: "Offline",
            sensibilidade: 0,
            luminosidade_atual: 0,
            Axios: axios.create({
                baseURL: 'http://192.168.0.25:8000/'        //* IP DA API
            }),
            intervalo: setInterval(this.atualizar, 500),    // atualiza os dados a cada meio segundo
        }
        
        this.intervalo = 500 
    }

    mudar_atualizaçao(){
        if (this.intervalo == 3000) {                                  // ao conseguir se conectar apos um erro, muda o timer de volta

        }
        if (this.state.botao_atualizaçao == "Parar Atualização"){
            clearInterval(this.state.intervalo)
            this.setState({
                status: "Offline",
                sensibilidade: 0,
                luminosidade_atual: 0,
            })
            this.setState({botao_atualizaçao: "Iniciar Atualização"}) 
        } else {
            this.setState({botao_atualizaçao: "Parar Atualização"})
            this.state.intervalo = setInterval(this.atualizar, this.intervalo)
        }
    
    }

    async atualizar() {
        let dado_sensor = await this.state.Axios.get(`/sensor`).then((res) => {
            if (this.intervalo == 3000) {                                  // ao conseguir se conectar apos um erro, muda o timer de volta
                clearInterval(this.state.intervalo)
                this.intervalo = 500
                this.state.intervalo = setInterval(this.atualizar, this.intervalo)
            }
            return res.data
        })
        .catch(async error => {         // no caso de algum erro ele espera um tempo maior para chamar novamente a funçao
            if (this.intervalo != 3000) {
                clearInterval(this.state.intervalo)
                this.intervalo = 3000
                this.state.intervalo = setInterval(this.atualizar, this.intervalo)
            }
        });
        
        if (dado_sensor) {
            this.setState({
                status: "Online",
                sensibilidade: dado_sensor.sensibilidade,
                luminosidade_atual: dado_sensor.luminosidade_atual,
            })
        } else {
            this.setState({
                status: "Offline",
                sensibilidade: 0,
                luminosidade_atual: 0,
            })
        }
        console.log("atualizar")
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalo)
    }

    async getHistorico() {
        let lista

        lista = await this.state.Axios.get("sensor/historico").then((res) => {
            return res.data
        })
        .catch(error => {
            lista = 0
        })
        return lista
    }
    
    render() {
        const { navigate } = this.props.navigation;
        const { botao_atualizaçao, status, sensibilidade, luminosidade_atual } = this.state


        return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.text}>Status Embarcado: {status}</Text>
                    <Text style={styles.text}>Sensibilidade: {sensibilidade}</Text>
                    <Text style={styles.text}>Luminosidade Atual: {luminosidade_atual}</Text>
                </View>
                <View style={styles.button}>
                    <Button title={botao_atualizaçao} onPress={() => this.mudar_atualizaçao()}/>
                </View>
                <View style={styles.button}>
                    <Button title="Ver Historico de Leituras" onPress={async () => {
                        let lista = await this.getHistorico(); return navigate('HistoricoLeituras', {lista: lista})}} />
                </View>
                <View style={styles.button}>
                    <Button title="Sair" onPress={() => BackHandler.exitApp()} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 2,
        borderRadius: 6,
        padding: 10,
        width: "110%",
        height: 60
    },
    container: {
        justifyContent: 'center',
        padding: 60,
    },
    text: {
        fontSize: 20,
        textAlign: "left"
    },
    reload: {
        width: 30,
        height: 30,
    },
    title: {
        padding: 30,
        fontSize: 18,
    },
    button: {
        padding: 15
    }
});