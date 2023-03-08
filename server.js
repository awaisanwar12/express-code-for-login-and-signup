const express = require("express")
const app = express()
var bodyParser = require('body-parser')
var cors = require("cors")
app.use(cors())
const userData = []

app.use(bodyParser.json())
const signup = (req, res) => {

    userData.push(req.body)
    
    res.json(userData)
    

}
app.post("/signup", signup)
const signin = (req, res) => {
    const email = req.body.email
    
    const password = req.body.password
    
    const user = userData.find(item => item.email === email && item.password === password)
    if (user) {
        const { email, password } = user
        const responseUser = { email, password }
        console.log(responseUser)
    
        
        res.json(responseUser)
    } else {
        res.status(401).json({ message: "invalid email or password" })
    }
}

app.post("/signin",  signin)

app.listen(5000, () => { console.log("Server started on port 5000") })