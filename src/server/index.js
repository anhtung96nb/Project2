require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

// Use of immutable js Map
const { Map } = require('immutable')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

app.post('/getInfo', async(req, res) => {
    try {
        const URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.robotName}?api_key=${process.env.API_KEY}`
        let data = await fetch(URL)
            .then(res => res.json())
        res.send(data.rover)

    } catch (err) {
        console.log('error:', err);
    }
})

app.post('/getImage', async(req, res) => {
    try {
        const URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.robotName}/photos?sol=200&api_key=${process.env.API_KEY}`
        let data = await fetch(URL)
            .then(res => res.json())
        res.send(data.photos)

    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))