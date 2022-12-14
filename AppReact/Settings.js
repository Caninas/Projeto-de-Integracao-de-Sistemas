import * as React from 'react';
import { View, Text, TextInput, Image, Button, BackHandler, StyleSheet } from 'react-native';
import axios from 'axios'

const InputSensi = props => {
    //const [number, onChangeNumber] = React.useState(null);
    const placeholder = props.sensibilidade

    return (
        <TextInput
            //ref={ref}
            style={styles.input}
            onChangeText={props.onTextChange}
            value={props.inputValue}
            placeholder={`${placeholder}`}
            keyboardType="numeric"
        />
    );
};

export default class SettingsScreen extends React.Component {
    constructor(props) {
        super(props)
        this.getConfig = this.getConfig.bind(this)
        //this.input_sensi = React.createRef();

        this.onTextChange = this.onTextChange.bind(this); 

        this.state = {      
            inputValue: '',                                    // COLOCAR CONFIGURAÇOES AQUI
            status: "Offline",
            sensibilidade: 0,
            urlAPI: props.state.urlAPI        //* IP DO EMBARCADO?
        }
    }

    async getConfig() {
        while (true) {
            console.log("while")
            let json
            try {
                const response = await fetch(`${this.state.urlAPI}/sensor/configuracao`)
                json = await response.json();
            } catch (error) {
                console.log("error getconfig")
            }

            console.log(json.sensibilidade)

            if (json.sensibilidade != undefined) {
                this.setState({
                    sensibilidade: json.sensibilidade
                })
                break
            } else {
                this.setState({
                    sensibilidade: 0
                })
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        //return this.state.sensibilidade

    }

    async configurar() {
        let sensibilidade = this.state.inputValue
        console.log(sensibilidade)
        let response
        try {
            response = await fetch(`${this.state.urlAPI}/sensor/configuracao`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sensibilidade: sensibilidade
                })
            })
        } catch (error) {
            console.log(error)
        }

        console.log(response) // if response == error { this.state.sensibilidade = "Offline"}
        // ou show status 
        // mostrar popup deu certo
    }

    componentDidMount() {
        this.getConfig()
    }

    onTextChange (text) {
        console.log(text)
        this.setState({inputValue: text});
    }

    render() {
        const { navigate } = this.props.navigation;
        //const { sensibilidade } = this.state.sensibilidade

        return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.text}>Status Embarcado: { }</Text>
                    <InputSensi 
                        //ref={this.input_sensi} 
                        sensibilidade={this.state.sensibilidade}
                        inputValue={this.state.inputValue}
                        onTextChange={this.onTextChange}
                        />
                </View>
                <View style={styles.button}>
                    <Button title="Alterar Configuração" onPress={() => this.configurar()} />
                </View>
                <View style={styles.button}>
                    <Button title="Ver Historico de Configurações?" onPress={async () => navigate('HistoricoLeituras', { lista: await this.getHistorico() })} />
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
    title: {
        padding: 30,
        fontSize: 18,
    },
    button: {
        padding: 15
    }
});