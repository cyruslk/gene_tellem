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
      spreadsheetData: null
    };
  }

  componentDidMount() {

    this.client = Stitch.initializeDefaultAppClient(stitchID);
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    this.db = mongodb.db("gene_db");
    this.retrieveDataFromDBOnLoad();

    axios.get(spreadsheetURL)
       .then((response) => {
         this.setState({
           spreadsheetData: response.data.feed.entry
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
    if(!this.state.dbContent){
      return (
        <div>
          loading
        </div>
      )
    }
    return (
      <div>
        fvdvvdv
      </div>
    );
  }
}

export default App;
