import React, { Component } from 'react';
import { Shake } from 'reshake'; // eslint-disable-line no-unused-vars
import './App.css';
import GeneCanvas from './GeneCanvas';
import getRandomColor from './colors';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pickenColour: '',
      data: [],
      headerData: [],
    };
  }

  componentDidMount() {
    fetch('/cms-data')
      .then((res) => { return res.json(); })
      .then((responseJson) => {
        const dataWithColors = responseJson.map((item) => {
          const color = getRandomColor();
          const colorString = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`;
          const backgroundColorString = `rgba(${color[0]}, ${color[1]}, ${color[2]})`;
          const colorDbCollectionName = color.join('');
          return {
            ...item,
            backgroundColorString,
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
      color: 'black',
    };
    const whiteBackgroundBlocsSpans = {
      color: 'black',
    };

    const { data, headerData, } = this.state;
    const items = data.map((item, i) => {
      const stringToArrayName = item.name.split('');
      const stringToArrayBluryText = item.name_end.split(' ');

      const newArrayName = [];
      const newArrayBluryText = [];

      const classNameList = ['hvr-wobble-horizontal', 'regular-span'];
      const classNameListFilter = ['hvr-wobble-horizontal', 'regular-span'];

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
              zIndex={1000}
              colorString="rgba(0, 0, 0, 0.5)"
              colorDbCollectionName="000"
            />
          </section>
        );
      }
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
            {' '}
            {newArrayBluryText}
          </h1>
          <GeneCanvas
            key={i + 4 * 4}
            zIndex={1000}
            colorString={item.colorString}
            colorDbCollectionName={item.colorDbCollectionName}
          />
        </section>
      );
    });

    const resultsRender = [];
    for (let i = 0; i < items.length; i += 1) {
      resultsRender.push(items[i]);
      // console.log(i, items[i]);
    }


    const coloredBackgroundHeader = {
      color: 'white',
      backgroundColor: this.state.pickenColour,
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
            {item.name}
          </span>
        );
      }
      return (
        <span key={i + 2 * 4}
          style={whiteBackgroundHeader}
        >
          {item.name}
        </span>
      );
    });

    const resultsRenderHeader = [];
    for (let i = 0; i < itemHeader.length; i += 1) {
      resultsRenderHeader.push(itemHeader[i]);
    }


    if (data.length < 1) {
      return (
        <div className="loader_screen_container" style={coloredBackgroundHeader}>
          <div className="loader_screen" />
        </div>

      );
    }
    return (
      <div className="main_container">
        <header>
          {resultsRenderHeader}
        </header>
        <div className="resultsRender_container">
          {resultsRender}
        </div>
      </div>
    );
  }
}

export default App;
