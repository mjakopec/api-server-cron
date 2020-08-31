const express = require('express');
const bodyParser = require('body-parser');
var CronJob = require("cron").CronJob;
const cron_time = require('./config/constants').cron_time;

// create express app
const app = express();
const cors = require('cors');
app.use(cors({ credentials: true,"Access-Control-Allow-Origin":"*" }));

// protect with Basic Authentification

const basicAuth = require('./_helpers/basic-auth');
app.use(basicAuth);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false }, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//Cron JOB
var job= new CronJob(cron_time, function() {
    console.log("FIRE");
  });
  job.start();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to application."});
});

require('./app/routes/note.routes.js')(app);
const port = 5000;
// listen for requests
app.listen(port, () => {
    console.log(`Next LH service is measuring on ${port} will be ${job.nextDates(1)}!`);
});