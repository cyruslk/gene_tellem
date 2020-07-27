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
import getRandomsColor from './colors';

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
      color: [],
      randomNumberCanvasToReturn: 1,
      pickenImages: null
    };
  }

  componentDidMount() {

    const color = getRandomsColor();
    const colorString1 = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const colorString = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`;
    const backgroundColorString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const colorDbCollectionName = color.join('');

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
      let dataWithColors = response.data.feed.entry.map((ele) => {
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
       })
     // adding everything in the state now;
      this.setState({
        data: dataWithColors,
        colorString: colorString,
        backgroundColorString: backgroundColorString
      }, () => {
        // console.log(this.state);
      })
       }).catch((err) => {
       console.log(err);
     });

     axios.get(spreadsheetURL)
     .then((response) => {
       let dataHeader = response.data.feed.entry
       .map((ele) => {
         return {
           name: ele.gsx$headerinfo.$t,
           link: ele.gsx$headerlink.$t
         };
       }).filter(ele => ele.name.length > 0);
       this.setState({
         headerData: dataHeader
       }, () => {
         // console.log(this.state);
       })
     }).catch(error => {
       console.log(error);
     });


     // get the randomy stuff here

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
        this.setState({
          dbContent
        })
      });
   }

  render() {

    const coloredBackgroundBlocsH1 = { color: 'white'};
    const coloredBackgroundBlocsSpans = { color: 'white'};
    const whiteBackgroundBlocsH1 = { color: this.state.backgroundColorString };
    const whiteBackgroundBlocsSpans = { color: 'white' };
    const { data, headerData, } = this.state;

    if(!this.state.dbContent){ return null }


    const items = data.map((item, i) => {

      const stringToArrayName = item.item.name.split('');
      const stringToArrayBluryText = item.item.name_end.split(' ');
      const newArrayName = [];
      const newArrayBluryText = [];
      const classNameList = ['shake-slow', 'regular-span'];
      const classNameListFilter = ['shake-slow', 'regular-span'];

      function convertToSpans(oldArray, newArray, animArray) {
      function returnRandomAnims(selectedAnimArray) {
        return selectedAnimArray[Math.floor(Math.random() * selectedAnimArray.length)];
      }
      oldArray.map((oldArrayItem, index) => {
        return newArray.push(
          <span key={index} className={returnRandomAnims(animArray)}>
            {oldArrayItem}
          </span>
        );
      });
    };


    convertToSpans(stringToArrayName, newArrayName, classNameList);
    convertToSpans(stringToArrayBluryText, newArrayBluryText, classNameListFilter);


    if (i % 2 === 0) {
      return (

        <section
          key={i}
          className="main_sections"
          style={{
            backgroundColor: item.backgroundColorString,
          }}
        >
          <h1 key={i + 1 * 1} style={coloredBackgroundBlocsH1}>
            {newArrayName}
            <span style={coloredBackgroundBlocsSpans}>
              {item.blury_text}
            </span>
            {newArrayBluryText}
          </h1>
          <GeneCanvas
            key={i + 4 * 4}
            zIndex={100}
            position={"absolute"}
            shouldDraw={false}
            colorString= {this.state.colorString}
            colorDbCollectionName="000"
          />
          <a className="block_links shake" style={coloredBackgroundBlocsSpans}
            href={item.link} rel="noopener noreferrer" target="_blank">{item.info_secondaire}</a>
        </section>
      );
    }
    return (
      <section key={i} className="main_sections">
        <h1 key={i + 1 * 1} style={whiteBackgroundBlocsH1}>
          {newArrayName}
          <span style={whiteBackgroundBlocsSpans}>
            {item.blury_text}
          </span>
          {newArrayBluryText}
        </h1>
        <GeneCanvas
          key={i + 4 * 4}
          zIndex={10000}
          position={"absolute"}
          shouldDraw={false}
          background={false}
          colorString= {this.state.colorString}
          colorDbCollectionName="000"
          dbContent={this.state.dbContent}
        />
        <a className="block_links shake" style={whiteBackgroundBlocsH1}
        href={item.link} rel="noopener noreferrer" target="_blank">{item.info_secondaire}</a>
      </section>
    );
  });

  const resultsRender = [];
  for (let i = 0; i < items.length; i += 1) {
    resultsRender.push(items[i]);
    }


  const coloredBackgroundHeader = {
    color: 'white',
    backgroundColor: this.state.backgroundColorString,
    border: 'none',
  };

  const whiteBackgroundHeader = {
    color: 'black',
    backgroundColor: 'white',
  };


  const itemHeader = headerData.map((item, i) => {
    if (i % 2) {
      return (
        <span key={i + 1 * 2}
          style={coloredBackgroundHeader}
        >
        <a href={item.link} target="_blank">
          {item.name}
        </a>
        </span>
      );
    }
    return (
      <span key={i + 2 * 4}
        style={whiteBackgroundHeader}
      >
      <a href={item.link} target="_blank">
        {item.name}
      </a>
      </span>
    );
  });

  const resultsRenderHeader = [];
  for (let i = 0; i < itemHeader.length; i += 1) {
    resultsRenderHeader.push(itemHeader[i]);
  }


  // loading stuff;
  if (data.length < 1) {
    return (
      <div className="loader_screen_container">
      <div className="loader_span_container shake-little">
            <span>LOADING</span>
          </div>
      </div>
    );
  }

  return (
    <div>
    <div className="loader_screen_container canvas_loader">
    <div className="loader_span_container shake-little">
          <span>LOADING</span>
        </div>
    </div>
    <div className="main_container">
      <header>
        {resultsRenderHeader}
      </header>
      <div className="resultsRender_container">
      <GeneCanvas
        key={4 * 4}
        zIndex={1}
        shouldDraw={false}
        position={"fixed"}
        colorString="rgba(0, 0, 0, 0.5)"
        colorDbCollectionName="000"
        dbContent={this.state.dbContent}
      />
        {resultsRender}
      </div>
      <section className="credits">
        code & design ---> &nbsp; <a href="http://www.c-t-l-k.com" target="_blank" rel="noopener noreferrer">www.c-t-l-k.com</a> &nbsp; (+ thanks to Conan Lai )
      </section>
    </div>
    </div>
  );
}
}

export default App;
