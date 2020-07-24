import React, { Component } from 'react';
import axios from "axios";
import { Shake } from 'reshake'; // eslint-disable-line no-unused-vars;
import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

import './App.css';
import GeneCanvas from './GeneCanvas';
import getRandomColor from './colors';

const CONFIG = require('./config.js');
const preFix = "https://spreadsheets.google.com/feeds/list/";
const sheetID = CONFIG.SHEET_ID;
const postFix = "/od6/public/values?alt=json"
const spreadsheetURL = preFix+sheetID+postFix;
const stitchID = CONFIG.STITCH_ID;
const dbID = CONFIG.DB_ID;


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dbContent: null,
      spreadsheetData: null,
      data: [],
      headerData: [],
      color: []
    };
  }

  componentDidMount() {

    const color = getRandomColor();

    // init the stitch thing
    this.client = Stitch.initializeDefaultAppClient(stitchID);
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    this.db = mongodb.db("gene_db");
    this.retrieveDataFromDBOnLoad();

    // get from the spreadsheet cms
    axios.get(spreadsheetURL)
    .then((response) => {

    // format the data;
    let dataWithColors = response.data.feed.entry.map(function(ele){
    const colorString1 = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const colorString = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`;
    const backgroundColorString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const colorDbCollectionName = color.join('');
    const item = {
      name: ele.gsx$name.$t,
      info_secondaire: ele.gsx$infosecondaire.$t,
      blury_text: ele.gsx$blurytext.$t,
      name_end: ele.gsx$nameend.$t,
      link: ele.gsx$link.$t
    };
    return {
      item,
      backgroundColorString,
      colorString1,
      colorString,
      colorDbCollectionName
    };

    this.setState({
      data: dataWithColors,
    });
   })
     }).catch((err) => {
     console.log(err);
   });
   };



  retrieveDataFromDBOnLoad = () => {
   this.client.auth
     .loginWithCredential(new AnonymousCredential())
     .then(this.retrieveDataFromDB)
     .catch(console.error);
 }

 retrieveDataFromDB = () => {
    // query the remote DB and update the component state
    this.db
      .collection("gene_db_black")
      .find({}, { limit: 1000 })
      .asArray()
      .then(dbContent => {
        this.setState({dbContent});
      });
   }

  render() {


    const coloredBackgroundBlocsH1 = {
      color: 'white',
    };
    const coloredBackgroundBlocsSpans = {
      color: 'white',
    };
    const whiteBackgroundBlocsH1 = {
      color: this.state.backgroundColorString,
    };
    const whiteBackgroundBlocsSpans = {
      color: 'white',
    };

    const classNameList = ['shake-slow', 'regular-span'];
    const classNameListFilter = ['shake-slow', 'regular-span'];


    if(!this.state.dbContent){
      return (
        <div>
          loading
        </div>
      )
    }

    // let populatePage = this.state.spreadsheetData.map((ele, index) => {
    //   console.log(ele, index);
    //   return <GeneCanvas index={index} ele={ele} />
    // })

    console.log(this.state);

    return (
      <div>
      ---
      </div>
    );
  }
}

export default App;
