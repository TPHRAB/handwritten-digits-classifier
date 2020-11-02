import './App.css';
import { useState, useRef, useEffect } from 'react'

function App() {
  // states
  let previous = []
  let current = []
  const width = 400
  const [drawing, setDrawing] = useState(false)
  const [ctx, setCtx] = useState()
  const [probabilities, setProbabilities] = useState([])

  // ref
  const canvasRef = useRef()

  // functions
  const draw = e => {
    updatePoint(e)
    ctx.beginPath()
    ctx.moveTo(previous[0], previous[1])
    ctx.lineTo(current[0], current[1])
    ctx.stroke()
  }

  const updatePoint = e => {
    previous = current
    let offsetLeft = canvasRef.current.offsetParent.offsetLeft
    let offsetTop = canvasRef.current.offsetParent.offsetTop
    current = [e.clientX - offsetLeft, e.clientY - offsetTop]
  }

  const restore = () => {
    setDrawing(false)
    current = []
  }
  
  const clear = () => {
    ctx.clearRect(0, 0, width, width)
  }

  // initialize
  useEffect(() => {
    let ctx = canvasRef.current.getContext('2d')
    ctx.lineWidth = 5
    setCtx(ctx)

    // set table of probablities
    for (let i = 0; i < 9; i++) {
      probabilities[i] = (
        <tr key={i}>
          <td>{i}</td>
          <td>{0}</td>
        </tr>
      )
    }
  }, [])
  
  return (
    <div id="window">
        <div id="canvas-control">
          <canvas
            width={width}
            height={width}
            onMouseDown={(e) => {
              setDrawing(true)
              updatePoint(e)
            }}
            onMouseMove={(e) => {
              if (drawing)
                draw(e)
            }}
            onMouseUp={() => {
              restore()
            }}
            onMouseOut={() => {
              restore()
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
          <tbody>{probabilities}</tbody>
        </table>
    </div>
  );
}

export default App;
