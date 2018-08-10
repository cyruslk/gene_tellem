import React, { Component } from 'react';
import { Shake } from 'reshake'; // eslint-disable-line no-unused-vars
import './App.css';
import GeneCanvas from './GeneCanvas';
import getRandomColor from './colors';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      headerData: [],
      // color: [],
    };
  }

  componentDidMount() {


    fetch('/cms-data')
      .then((res) => { return res.json(); })
      .then((responseJson) => {
        const dataWithColors = responseJson.map((item) => {
          const color = getRandomColor();
          const colorString1 = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          const colorString = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`;
          const backgroundColorString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          this.setState({
            colorString: colorString
          })
          this.setState({
            backgroundColorString: backgroundColorString
          })
          const colorDbCollectionName = color.join('');
          return {
            ...item,
            backgroundColorString,
            colorString1,
            colorString,
            colorDbCollectionName,
          };
        });
        this.setState({
          data: dataWithColors,
        });
      });

    fetch('/cms-data-header')
      .then((res) => { return res.json(); })
      .then((responseJson) => {
        // console.log("this is the header ->", responseJson);
        this.setState({
          headerData: responseJson,
        });
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

    const { data, headerData, } = this.state;
    const items = data.map((item, i) => {
      const stringToArrayName = item.name.split('');
      const stringToArrayBluryText = item.name_end.split(' ');

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
      }
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
              colorString={item.colorString}
              colorDbCollectionName="000"
            />
            <a className="block_links shake" style={coloredBackgroundBlocsSpans}
              href={item.link} rel="noopener noreferrer" target="_blank">{item.info_secondaire}</a>
          </section>
        );
      }
      return (
        <section key={i} className="main_sections">
          <h1 key={i + 1 * 1} style={{ color: item.backgroundColorString, }}>
            {newArrayName}
            <span style={{ color: item.backgroundColorString }}>
              {item.blury_text}
            </span>
            {newArrayBluryText}
          </h1>
          <GeneCanvas
            key={i + 4 * 4}
            zIndex={10000}
            position={"absolute"}
            shouldDraw={true}
            background={false}
            colorString={item.colorString}
            colorDbCollectionName="000"
          />
          <a className="block_links shake" style={{ color: item.backgroundColorString }}
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
