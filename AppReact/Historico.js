import * as React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';


export default class HistoricoScreen extends React.Component {
    static navigationOptions = {
        title: "Histórico Leituras",
    }

    render() {
        const { navigate } = this.props.navigation
        const { lista } = this.props.navigation.state.params

        if (lista != undefined && lista.length) {               // caso seja undefined ele nao testa a direita da expressao (resolve erro)
            return (
                <View style={styles.container_table}>
                    <Table>
                        <Row data={["hora", "valor"]} style={styles.container_header} textStyle={styles.text_header} />
                    </Table>
                    <ScrollView>
                        <Table>
                            <Rows
                                data={lista}
                                style={styles.row}
                                textStyle={styles.text_rows}
                            />

                        </Table>
                    </ScrollView>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Histórico Vazio</Text>
                    <View style={styles.button}>
                        <Button title="Voltar" onPress={() => navigate('Home')} />
                    </View>
                </View >
            )
        }
    }
}

const styles = StyleSheet.create({
    container_header: {
        height: 40,
        backgroundColor: '#6F7BD9',
    },
    head: {
        height: 50,
        backgroundColor: '#6F7BD9',
    },
    text_header: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 20,
    },
    text_rows: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 20,
    },
    row: {
        height: 40,
        borderWidth: 1,
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        width: "100%",
        height: "100%"
    },
    button: {
        padding: 60
    },
    text: {
        fontSize: 30,
    },

});