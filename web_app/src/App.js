import './App.css';
import { useState, useRef, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs';
import resizeImageData from 'resize-image-data';


function App() {
  // states
  let previous = [];
  let current = [];
  const width = 400;
  let drawing = false;
  const [ctx, setCtx] = useState();
  const [probabilities, setProbabilities] = useState([]);
  const [model, setModel] = useState();

  // ref
  const canvasRef = useRef();

  // functions
  const draw = e => {
    updatePoint(e);
    ctx.beginPath();
    ctx.moveTo(previous[0], previous[1]);
    ctx.lineTo(current[0], current[1]);
    ctx.stroke();
  }

  const updatePoint = e => {
    previous = current;
    let offsetLeft = canvasRef.current.offsetParent.offsetLeft;
    let offsetTop = canvasRef.current.offsetParent.offsetTop;
    current = [e.clientX - offsetLeft, e.clientY - offsetTop];
  }

  const restore = () => {
    drawing = false;
    current = [];
  }
  
  const clear = () => {
    ctx.clearRect(0, 0, width, width);
  }

  const predict = async () => {
    if (drawing) {
      restore();
      let raw_img = ctx.getImageData(0, 0, width, width);
      // rescale image
      raw_img = resizeImageData(raw_img, 28, 28);

      // covert data to the shape required by the model
      let processed_img = [];
      for (let i = 0; i < raw_img.height; i++) {
        let currentRow = [];
        for (let j = 0; j < raw_img.width; j++) {
          let index = (i * 4) * raw_img.width + j * 4;
          currentRow.push([raw_img.data[index + 3]]);
        }
        processed_img.push(currentRow);
      }

      let predictions = await model.predict(tf.tensor([processed_img])).data();
      setProbabilities([...predictions]);
    }
  }

  // initialize
  useEffect(() => {
    let ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 10;
    setCtx(ctx);

    // load model using anonymouse async function
    (async () => {
      let model = await tf.loadLayersModel('/saved_model/model.json');
      setModel(model);
    })()
  }, [])
  
  return (
    <div id="window">
        <div id="canvas-control">
          <canvas
            width={width}
            height={width}
            onMouseDown={(e) => {
              drawing = true
              updatePoint(e)
            }}
            onMouseMove={(e) => {
              if (drawing)
                draw(e)
            }}
            onMouseUp={() => {
              predict()
            }}
            onMouseOut={() => {
              predict()
            }}
            ref={canvasRef}
          >
          </canvas>
            <button
              onClick={clear}
            >Clear</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Digit</th>
              <th>Probability</th>
            </tr>
          </thead>
          <tbody>
            {
              probabilities.map((prob, i) => {
                return (
                  <tr key={i}>
                    <td>{i}</td>
                    <td>{prob}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
    </div>
  );
}

export default App;
