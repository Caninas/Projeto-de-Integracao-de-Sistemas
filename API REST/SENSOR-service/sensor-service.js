const express = require('express')
const bodyParser = require('body-parser')
const Sensor = require('./model/sensor')
//const Motor = require('./model/motor')
const axios = require('axios')

const app = express()

//Servidor
let porta = 8100
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta)
})

const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb+srv://pedrocaninas:rtSHHDWEKTCqQMz9@cluster0.kawxe5x.mongodb.net/?retryWrites=true&w=majority'
const database_name = 'ProjetoFinal'
const collection_name= 'HistoricoSensor'
const instAxios = axios.create({
    baseURL: 'http://localhost:8000/'
})

var db
var sensor
var cache_historico = []

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
    if(error) {
        console.log('ERRO: não foi possível conectar à base de dados ` ' + database_name + ' `.')
        throw error
    }
    db = client.db(database_name).collection(collection_name)
    console.log(`Conectado à base de dados ${database_name}!`)
    await CriarSensor()
})
//Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

async function CriarSensor() {
    sensor = await db.findOne({ _id: "sensor" })

    if (!sensor) {
        console.log("Criando Sensor no banco")
        sensor = new Sensor()
        
        await db.insertOne(sensor, (err, result) => {
            if (err) return console.log("Error: " + err)
            return sensor
        })
    }
}

// Ler dado do sensor
app.get('/sensor', async (req, res, next) => {
    sensor = await db.findOne({ _id: "sensor" })
    res.send(sensor.hist)
})

// Ler historico do sensor
app.get('/sensor/historico', async (req, res, next) => {
    sensor = await db.findOne({ _id: "sensor" })
    
    sensor.hist = sensor.hist.concat(cache_historico)
    cache_historico = []

    res.send(sensor.hist)

    db.updateOne({ _id: "sensor" }, {
        $set: {
            hist: sensor.hist
        }
    })
})

// Muda configuraçao do embarcado               led_liga = luz > sensibilidade ; velocidade motor
app.post('/sensor/sensibilidade', async (req, res, next) => {
    sensibilidade = req.body.sensibilidade

    // mandar para o embarcado a sensibilidade
    // webserver... fazer um post la axios
    // altera a variavel sensibilidade e retorna resposta ok

    db.updateOne({ _id: "sensor" }, {
        $set: {
            sensibilidade: sensibilidade
        }
    }) 
})

// app.post('/sensor/sensibilidade', async (req, res, next) => { botar no serviço motor
//     vel_motor = req.body.velocidade
    
// })


// Recebe leitura, guarda em cache e chegando em um limite chama POST
app.put('/sensor/:leitura', async (req, res, next) => {

})


// limpa historico de leituras
app.delete('/sensor/historico', async (req, res, next) => {
    sensor = await db.findOne({ _id: "sensor" })
    
    sensor.hist = []

    res.send("Histórico de leituras excluído!")


    db.updateOne({ _id: "sensor" }, {
        $set: {
            hist: sensor.hist
        }
    })
})