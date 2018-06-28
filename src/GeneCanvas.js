import React, { Component } from 'react';
import './App.css';
import fetch from 'cross-fetch';


class App extends Component {

  constructor(props) {
      super(props);

      this.state = {
        canvas: "",
        context: "",
        current: "",
        drawing: true,
        pickenImages: "",
        numberOfCanvases: 1,
        populate: this.props.populate,
        zIndex: this.props.zIndex
      };

      this._onMouseMove = this._onMouseMove.bind(this);
      this._onMouseDown = this._onMouseDown.bind(this);
      this._onMouseUp = this._onMouseUp.bind(this);
      this._onMouseOut = this._onMouseOut.bind(this);
    }

    componentDidMount() {
         this.getCanvas();
         this.fetchImages();
     }

     getCanvas() {
       this.setState({
         canvas: this.refs.canvas,
         context: this.refs.canvas.getContext('2d'),
         current: {color: this.props.color}
       })
    }


    fetchImages() {
      const url = `/random/${this.state.numberOfCanvases}`;
      fetch(url)
          .then((res) => {
          return res.json();
          }).then((results) => {
            this.setState({
              pickenImages: results[0]
            })
            this.populateImage();
          })
      }

    populateImage(){

      console.log(this.state.pickenImages, "---->");
      if(this.state.populate){
        // console.log("HERE!", this.state.pickenImages);
        const img = new Image();
        img.src = this.state.pickenImages;
        var that = this;
        img.onload = function() {
         that.state.context.drawImage(img, 0, 0);
        };

      }
    }


    drawLine(x0, y0, x1, y1, color){
      const context = this.state.context;
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 100;
      context.filter = 'blur(20px)';
      context.stroke();
      context.closePath();
    }

    _onMouseDown(e){
      // this.state.drawing = true;
      const current = this.state.current;
      current.x = e.clientX;
      current.y = e.clientY;
    }

    _onMouseUp(e){
    if (!this.state.drawing) {
      return;
    }
      // this.state.drawing = true;
      const current = this.state.current;
      this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color);
    }

   _onMouseOut(e){
      this._onMouseUp(e);
      this.createImage();
    }

    _onMouseMove(e){
      const current = this.state.current;
      this.drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
      current.x = e.clientX;
      current.y = e.clientY;
    }



    createImage(){
      const data = {
       data: this.state.canvas.toDataURL(),
     };
     this.setState({
       pickenImages: data
     })
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
       var previousCall = new Date().getTime();
       return function() {
         var time = new Date().getTime();

         if ((time - previousCall) >= delay) {
           previousCall = time;
           callback.apply(null, arguments);
         }
       };
     }


  render() {

      const style = {zIndex: this.state.zIndex}

      return (
        <div className="main_container">
        <canvas className="canvas"
        onMouseMove={this._onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseUp={this._onMouseUp}
        onMouseOut={this._onMouseOut}
        style={style}
        ref="canvas"
        />
         </div>
      )
  }
}

export default App;
