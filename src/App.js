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
    };
    const whiteBackgroundBlocsH1 = {
      color: this.state.pickenColour
    };

    const whiteBackgroundBlocsSpans = {
      color: this.state.pickenColour
    }


    var items = this.state.data.map((item, i) => {


      const stringToArrayName = item.name.split("");
      const stringToArrayBluryText = item.name_end.split(" ");

      const newArrayName = [];
      const newArrayBluryText = [];


      // to optimize
      const classNameList = ["hvr-wobble-horizontal", "regular-span"];
      const classNameListFilter = ["hvr-wobble-horizontal", "regular-span"];



      function convertToSpans(oldArray, newArray, animArray){

        function returnRandomAnims(animArray){
          return animArray[Math.floor(Math.random() * animArray.length)];
        }
         oldArray.map((item, i) => {
          newArray.push(<span key={i} className={returnRandomAnims(animArray)}>{item}</span>)
        })
      };
      convertToSpans(stringToArrayName, newArrayName, classNameList);
      convertToSpans(stringToArrayBluryText, newArrayBluryText, classNameListFilter);



      if(i % 2 === 0){
        return (

               <section key={i} className="main_sections">
                      <h1 key={i+1*1} style={whiteBackgroundBlocsH1}>{newArrayName}
                        <span style={whiteBackgroundBlocsSpans}>{item.blury_text}</span>{newArrayBluryText}
                      </h1>
                      <GeneCanvas
                        key={i+4*4}
                        populate={true}
                        zIndex={1}
                        color={"black"}
                        className="canvas"/>
                </section>
              )

      }else{
        return (

               <section key={i} className="main_sections" style={coloredBackgroundBlocs}>
                      <h1 key={i+1*1} style={coloredBackgroundBlocsH1}>{newArrayName}
                          <span style={coloredBackgroundBlocsSpans}>{item.blury_text}</span> {newArrayBluryText}
                       </h1>
                       <GeneCanvas
                         key={i+4*4}
                         populate={false}
                         zIndex={1000}
                         color={this.state.pickenColour}
                         className="canvas"/>
                </section>
              )
      }
    })

    var resultsRender = [];
    for (var i = 0; i < items.length; i++) {
      resultsRender.push(items[i]);

      console.log(i, items[i]);

      console.log();

      // if (i % 2 === 0) {
      //   console.log("---");
      //   resultsRender.push(
      //     <GeneCanvas key={i+4*4} className="canvas"/>
      //   );
      // }
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
          style={coloredBackgroundHeader}>
            {item.name}
          </span>
        )
      }else{
        return (
            <span key={i+2*4}
            style={whiteBackgroundHeader}>
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
           <div className="resultsRender_container">
           {resultsRender}
           </div>
         </div>
      )
    }
  }
}

export default App;
