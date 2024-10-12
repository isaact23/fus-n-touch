import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { CompactPicker } from 'react-color';
import { useState, useRef } from 'react';
import { analyzeImage } from './image-gen';

function App() {
  const [color, setColor] = useState("pink");
  const [timeoutId, setTimeoutId] = useState(null); // Track the timeout
  const canvasRef = useRef(); // Create a ref to access the canvas instance

  const handleColorChange = (colorObj) => {
    setColor(colorObj.hex); // Extract hex value from the color object
  };

  const handleStroke = () => {
    if (timeoutId) clearTimeout(timeoutId); // Clear previous timeout

    const newTimeoutId = setTimeout(() => {
      saveImage(); // Save image after 10s of inactivity
    }, 10000);

    setTimeoutId(newTimeoutId); // Store timeout ID
  };

  const saveImage = async () => {
    let base64Image = null
    try {
      base64Image = await canvasRef.current.exportImage('png'); // Get base64 image
    } catch (error) {
      console.error('Error exporting image:', error);
      return
    }

    //console.log('Saved Base64 Image:', base64Image);

    analyzeImage(base64Image)
      .then(result=>{
        console.log(result.url)
        console.log(result.fact)
      })
      .catch(err=>{
        console.error('Error generating image:', err)
      })
  };

  const handleErase = () => {
    canvasRef.current.clearCanvas(); // Clear the canvas
  };

  return (
    <div className="App-header">
      <h1>Fuse-N-Touch</h1>
      <ReactSketchCanvas
        ref={canvasRef}
        width="100%"
        height="500px"
        strokeWidth={4}
        strokeColor={color}
        onStroke={handleStroke}
      />
      <div className="controls">
        <CompactPicker color={color} onChange={handleColorChange} />
        <button className="Erase-Button" onClick={handleErase}>
          Erase Canvas
        </button>
      </div>
    </div>
  );
}

export default App;

