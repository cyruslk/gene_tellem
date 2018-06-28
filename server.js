const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const axios = require('axios');
const CONFIG = require('./config.js');
const preFix = "https://spreadsheets.google.com/feeds/list/";
const sheetID = CONFIG.SHEET_ID;
const postFix = "/od6/public/values?alt=json"
const spreadsheetURL = preFix+sheetID+postFix;

const mongouri = process.env.MONGODB_URI || CONFIG.MONGODB_URI;
const dbName = process.env.DB_NAME || CONFIG.DB_NAME;
const collectionName_black = process.env.COLLECTION_NAME_BLACK || CONFIG.COLLECTION_NAME_BLACK;


const dbLayerBlack = require('./dbLayer')(mongouri, dbName, collectionName_black);

app.use(express.static(__dirname + '/public'));
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({ limit: '450kb' }));


app.get("/cms-data", (req, res) => {
  axios.get(spreadsheetURL)
    .then(response => {
        var newData = response.data.feed.entry.map(function(ele){
        return {
                name: ele.gsx$name.$t,
                info_secondaire: ele.gsx$infosecondaire.$t,
                blury_text: ele.gsx$blurytext.$t,
                name_end: ele.gsx$nameend.$t,
                link: ele.gsx$link.$t};
              })
        res.json(newData);
    })
    .catch(error => {
      console.log(error);
    });
})


app.get("/cms-data-header", (req, res) => {
  axios.get(spreadsheetURL)
    .then(response => {
      var dataHeader = response.data.feed.entry
      .map(function(ele){
         return {name: ele.gsx$headerinfo.$t, link: ele.gsx$headerlink.$t};
       }).filter(ele => ele.name.length > 0)
       res.json(dataHeader);
    })
    .catch(error => {
      console.log(error);
    });
})

app.post('/sendPic', (req, res) => {
  console.log(req.body);
  dbLayerBlack.putOne(req.body.data)
    .then(() => {
      res.sendStatus(200);
    });
})

app.get('/random/:number', (req, res) => {
  dbLayerBlack.getRandoms(req.params.number)
    .then((result) => {
      res.send(result);
    })
})

app.listen(port, () => {
  console.log('listening on port ' + port)
});
