import React, { Component } from 'react';
import './App.css';
import is from 'is_js';

class App extends Component {
  throttledSetCanvasSize = this.throttle(this.setCanvasSize, 200);

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
      lineWidth: 400,
    };
  }

  componentDidMount() {
    this.setCanvasSize();
    window.addEventListener('resize', this.throttledSetCanvasSize);
    this.dbColorString = this.props.colorString.slice(5, -1).split(', ').slice(0, 3).join('');
    if (this.props.shouldDraw === true) {
      this.fetchImages();
    }

    const isSafari = is.safari();
    if (isSafari === true) {
      this.setState({
        lineWidth: 0,
        chromeOrFirefox: false
      });
    }
  }

  setCanvasSize = () => {
    const container = this.container.current;
    const canvas = this.canvas.current;
    const data = canvas.toDataURL();
    const { width, height, } = container.getBoundingClientRect();
    this.setState({
      height,
      width,
    }, () => {
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = data;
      img.onload = () => {
        context.drawImage(img, 0, 0, width, height);
      };
    });
  }

  fetchImages() {
    const url = `/random/color/${this.dbColorString}`;
    fetch(url)
      .then((res) => {
        return res.json();
      }).then((results) => {
        if (results.length > 0) {
          console.log('found image')
          this.setState({
            pickenImages: results[0],
          }, () => {
            this.populateImage();
          });
        }
      });
  }

  populateImage = () => {
    const img = new Image();
    img.src = this.state.pickenImages;
    img.onload = () => {
      const canvas = this.canvas.current;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }

  drawLine(x0, y0, x1, y1, color) {
    if (this.state.chromeOrFirefox === true) {
      const context = this.canvas.current.getContext('2d');
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = this.state.lineWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.filter = 'blur(20px)';
      context.stroke();
      context.closePath();
    } else {
      return;
    }
  }

  _onMouseOut = (e) => {
    this.createImage();
  }

  _onMouseMove = (e) => {
    const topOfElement = this.canvas.current.getBoundingClientRect().top + document.documentElement.scrollTop;
    const x = e.pageX;
    const y = e.pageY - topOfElement;
    const currentCoords = {
      x,
      y,
    };
    const current = this.current || currentCoords;
    this.drawLine(current.x, current.y, x, y, this.props.colorString, true);
    this.current = currentCoords;
  }


  _onMouseOver = (e) => {
    if (!this.state.hasMousedOver
      && this.state.shouldDraw) {
      const canvas = this.canvas.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({
        hasMousedOver: true,
      });
    }
  }

  createImage() {
    // REMOVED FOR NOW
    const data = {
      data: this.canvas.current.toDataURL(),
    };

    fetch(`/sendPic/${this.dbColorString}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
    }).then((res) => {
      console.log("successfully sent to db");
    });
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
    const style = {
      zIndex: this.props.zIndex,
      height: '100%',
      width: '100%',
      position: this.props.position
    };

    return (
      <div
        className="main_container"
        ref={this.container}
      >{
          this.props.shouldDraw === true ? (
            <canvas
              width={this.state.width}
              height={this.state.height}
              className="canvas"
              onMouseMove={this.throttledDraw}
              onMouseOut={this._onMouseOut}
              onMouseOver={this._onMouseOver}
              style={style}
              ref={this.canvas}
            />
          ) : (
              <canvas
                width={this.state.width}
                height={this.state.height}
                className="canvas"
                style={style}
                ref={this.canvas}
              />
            )
        }
      </div>
    );
  }
}

export default App;
