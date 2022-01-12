const express = require('express')
const serviceRoute = require("./routes/service")
const departmentRoute = require("./routes/department")
const userRoute = require("./routes/user")
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/sendEmail', (req, res) => {
  var sendEmail = require('./sendEmail.js');
   
      sendEmail.sendEmail("Test SNS Email from Sumadhur");
  
  res.send('Send Email')

})

app.get('/createTopic', (req, res) => {
  var createTopic = require('./createTopic.js');
   
      createTopic.createTopic("Topic3","sumo.vaidyula@gmail.com");
  
  res.send('Send Email')

})

app.use("/service", serviceRoute)
app.use("/department", departmentRoute)
app.use("/user", userRoute)
//app.use("/dummy", demoRoute)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})