import React, { Component } from 'react';
import './App.css';
import is from "is_js";

class App extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.container = React.createRef();
    this.state = {
      pickenImages: '',
      hasMousedOver: true,
      shouldDraw: this.props.shouldDraw,
      shouldDisplayBackground: this.props.background,
      chromeOrFirefox: true,
      lineWidth: 400
    };
  }

  componentDidMount(){

    let ele = this.props.ele;
    let name = ele.gsx$name.$t;
    let bluryText = ele.gsx$blurytext.$t;

  }



  throttle(callback, delay) {
    let previousCall = new Date().getTime();
    return function () {
      let time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback(...arguments);
      }
    };
  }

  throttledDraw = this.throttle(this._onMouseMove, 100);

  render() {

    let ele = this.props.ele;
    let name = ele.gsx$name.$t;
    let bluryText = ele.gsx$blurytext.$t;

    if(!ele){
      return null;
    }

      return (
        <div className="main_container" ref={this.container}>
          {name}
        </div>
      );
  }
}

export default App;
