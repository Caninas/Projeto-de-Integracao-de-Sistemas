const express = require('express')
const bodyParser = require('body-parser')
const Sensor = require('./model/sensor')
//const Motor = require('./model/motor')
const axios = require('axios')

const app = express()

//Servidor
let porta = 8080
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
    await CriarSensorNoBanco()
})
//Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

async function CriarSensorNoBanco() {                              //* OK
    sensor = await db.findOne({ _id: "sensor" })

    if (!sensor) {
        console.log("Criando Sensor no banco")
        sensor = new Sensor()
        
        await db.insertOne(sensor, (err, result) => {
            if (err) return console.log("Error: " + err)
            return sensor
        })
    } else {
        console.log("Resetando histórico no banco")
        db.updateOne({ _id: "sensor" }, {
            $set: {
                hist: []
            }
        })
    }
}

// Ler dado do sensor
app.get('/sensor', async (req, res, next) => {              //! ALTERAR
    res.send({
        status: "Online",
        sensibilidade: 100,
        luminosidade_atual: 378
    })
})


// Ler historico do sensor e guarda cache
app.get('/sensor/historico', async (req, res, next) => {     //* OK
    sensor = await db.findOne({ _id: "sensor" })
    
    // junta cache no historico do banco
    sensor.hist = sensor.hist.concat(cache_historico)
    cache_historico = []

    res.send(sensor.hist)
    console.log(sensor.hist)

    // atualiza o historico no banco
    db.updateOne({ _id: "sensor" }, {
        $set: {
            hist: sensor.hist
        }
    })
})

// Muda configuraçao do embarcado               led_liga = luz > sensibilidade ; velocidade Motor
app.post('/sensor/sensibilidade', async (req, res, next) => {       //! ALTERAR
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


// Recebe leitura, guarda em cache e chegando em um limite chama POST
app.put('/sensor', async (req, res, next) => {                  //* OK

    if (req.body.leitura){
        // Pega o horario atual e coloca 0 na frente se o numero tiver tamanho 1
        data = new Date(Date.now())

        let hora = (data.getHours().toString()).length.length == 2 ? data.getHours() : `0${data.getHours()}`
        let minutos = (data.getMinutes().toString()).length == 2 ? data.getMinutes() : `0${data.getMinutes()}`
        let segundos = (data.getSeconds().toString()).length == 2 ? data.getSeconds() : `0${data.getSeconds()}`
        
        data = `${hora}:${minutos}:${segundos}`

        // coloca no cache formatado
        cache_historico.push([data, req.body.leitura])

        // caso o cache passar dos 100 itens eles sao guardados (atraves do metodo get que faz isso automaticamente por motivos de consistencia) 
        if (cache_historico.length >= 100) {
            instAxios.get("sensor/historico")
        }

        res.send("Leitura recebida!")
    } else {
        res.status(400)
        res.send("Leitura inválida!")
    }                   

})


// Limpa historico de leituras
app.delete('/sensor/historico', async (req, res, next) => {         //* OK
    res.send("Histórico de leituras excluído!")

    db.updateOne({ _id: "sensor" }, {
        $set: {
            hist: []
        }
    })
})