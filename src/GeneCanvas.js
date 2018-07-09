import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.container = React.createRef();
    this.state = {
      pickenImages: '',
      hasMousedOver: false,
    };
  }

  componentDidMount() {
    this.setCanvasSize();
    window.addEventListener('resize', this.throttledSetCanvasSize);
    // this.getCanvas();
    this.fetchImages();
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

  throttledSetCanvasSize = this.throttle(this.setCanvasSize, 200);

  fetchImages() {
    const url = `/random/1`;
    fetch(url)
      .then((res) => {
        return res.json();
      }).then((results) => {
        this.setState({
          pickenImages: results[0],
        });
        this.populateImage();
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
    const context = this.canvas.current.getContext('2d');
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 200;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.filter = 'blur(20px)';
    context.stroke();
    context.closePath();
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
    if (!this.state.hasMousedOver) {
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
    // const data = {
    //   data: this.state.canvas.toDataURL(),
    // };
    // this.setState({
    //   pickenImages: data,
    // });
    // fetch('/sendPic', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'content-type': 'application/json'
    //   },
    // }).then((res) => {
    //   console.log("successfully sent to db");
    // })
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
    };

    return (
      <div
        className="main_container"
        ref={this.container}
      >
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
      </div>
    );
  }
}

export default App;
