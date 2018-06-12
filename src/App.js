import React, { Component } from 'react';
import GeneCanvas from './GeneCanvas.js';
import './App.css';
import fetch from 'node-fetch';


class App extends Component {

  constructor(props) {
      super(props);

      this.state = {
          pickenColour: "",
          data: [],
          headerData: []
      };
      this.sectionHeight = React.createRef()
    }

    componentDidMount(){


     fetch('/cms-data')
     .then(res => res.json())
     .then((responseJson) =>{
      this.setState({
        data: responseJson
      });
    })

    fetch('/cms-data-header')
    .then(res => res.json())
    .then((responseJson) =>{
     this.setState({
       headerData: responseJson
     });

   })

      const colorsRandom = [
        "#00ff00",
          "DarkSlateBlue",
          "GoldenRod",
          "LightBlue",
          "LightSeaGreen",
          "LightSteelBlue",
          "Purple",
          "Salmon"
      ];

      function returnColour(){
         return colorsRandom[Math.floor(Math.random()*((colorsRandom.length-1)-0+1))];
      }
      let thePickenColour = returnColour();

      this.setState({
        pickenColour: thePickenColour
      })



    }

  render() {

    const coloredBackgroundBlocs = {
      backgroundColor: this.state.pickenColour
    }
    const coloredBackgroundBlocsH1 = {
      color: "white"
    }
    const coloredBackgroundBlocsSpans = {
      color: "white"
    }
    const whiteBackgroundBlocs = {
      backgroundColor: "white"
    }
    const whiteBackgroundBlocsH1 = {
      color: this.state.pickenColour
    }
    const whiteBackgroundBlocsSpans = {
      color: this.state.pickenColour
    }

    const test = {
      color: "red"
    }


    var items = this.state.data.map((item, i) => {


      console.log("this is the item", item);

      const stringToArray = item.name.split("");
      const newArray = [];


      function makeRandomAnims(){
         stringToArray.map((item, i) => {
          newArray.push(<span key={i} >{item}</span>)
        })
        console.log("this is the new array", newArray);
        console.log("--->", newArray.length);
      }

      makeRandomAnims();

      if(i % 2 === 0){
        return (

               <section key={i} className="main_sections">
                      <h1 key={i+1*1} style={whiteBackgroundBlocsH1}>{newArray}
                        <span style={whiteBackgroundBlocsSpans}>{item.blury_text}</span>{item.name_end}
                      </h1>
                </section>
              )

      }else{
        return (

               <section key={i} className="main_sections" style={coloredBackgroundBlocs}>
                      <h1 key={i+1*1} style={coloredBackgroundBlocsH1}>{item.name}
                          <span style={coloredBackgroundBlocsSpans}>{item.blury_text}</span>{item.name_end}
                       </h1>
                </section>
              )
      }
    })

    var resultsRender = [];
    for (var i = 0; i < items.length; i++) {
      resultsRender.push(items[i]);

      console.log(i, items[i]);

      console.log();

      if (i % 2 === 0) {
        console.log("---");
        resultsRender.push(
          <GeneCanvas key={i+4*4} className="canvas"/>
        );
      }
    }


    const coloredBackgroundHeader = {color: "white",
                                     backgroundColor: this.state.pickenColour,
                                     border: "none"};

    const whiteBackgroundHeader = {color: "black",
                                   backgroundColor: "white"};

    var itemHeader = this.state.headerData.map((item, i) => {
      if(i%2){
        return (
          <span key={i+1*2}
          ref={this.myDiv}
          style={coloredBackgroundHeader}>
            {item.name}
          </span>
        )
      }else{
        return (
            <span key={i+2*4}
            style={whiteBackgroundHeader}
            ref={this.myDiv}>
              {item.name}
            </span>
        )
      }
    })

    var resultsRenderHeader = [];
    for (i = 0; i < itemHeader.length; i++) {
      resultsRenderHeader.push(itemHeader[i]);
    }


    if(this.state.data.length < 1){
      return (
        <div className='loader_screen_container' style={coloredBackgroundHeader}>
          <div className="loader_screen">
          </div>
        </div>

      )
    }else{
      return (
        <div className="main_container">
           <header>
           {resultsRenderHeader}
           </header>
           {resultsRender}
         </div>
      )
    }
  }
}

export default App;
