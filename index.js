require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const {Seq, Map,List} = require("immutable");


const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))


app.get('/rovers/:rover', async (req, res) => {
    try {
        let {rovers} = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`)
            .then(res => res.json())

             let maxdate = Seq(rovers).filter(item =>item.name === req.params.rover).get(0).max_date;

             try {
                let temp = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.rover}/photos?earth_date=${maxdate}&api_key=${process.env.API_KEY}`)
                    .then(res => res.json())

                let images = Map(temp).get('photos');
                let lastImage = List(images).maxBy(i=>i.id)

                console.log(lastImage)
                res.send(lastImage)
            } catch (err) {
                console.log('error:', err);
            }

    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))