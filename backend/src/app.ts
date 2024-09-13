import router from "./routes"

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)




const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Express server is listening at http://localhost:${PORT}`)
});