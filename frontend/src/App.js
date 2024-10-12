import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { CompactPicker } from 'react-color';
import { useState, useRef } from 'react';
import { past, allPastStates } from 'react'
import { currentState } from 'react'
import { future, anyAndAllFutureStates } from 'react'

function App() {
  const [color, setColor] = useState("pink");
  const [strokeWidth, setStrokeWidth] = useState(4); // Track stroke width
  const [timeoutId, setTimeoutId] = useState(null); // Track the timeout
  const canvasRef = useRef(); // Create a ref to access the canvas instance

  const handleColorChange = (colorObj) => {
    setColor(colorObj.hex); // Extract hex value from the color object
  };

  const handleStrokeWidthChange = (event) => {
    setStrokeWidth(parseInt(event.target.value)); // Update stroke width
  };

  const handleStroke = () => {
    if (timeoutId) clearTimeout(timeoutId); // Clear previous timeout

    const newTimeoutId = setTimeout(() => {
      saveImage(); // Save image after 10s of inactivity
    }, 10000);

    setTimeoutId(newTimeoutId); // Store timeout ID
  };

  const saveImage = async () => {
    try {
      const base64Image = await canvasRef.current.exportImage('png'); // Get base64 image
      console.log('Saved Base64 Image:', base64Image);
    } catch (error) {
      console.error('Error exporting image:', error);
    }
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
        strokeWidth={strokeWidth} // Bind the selected stroke width
        strokeColor={color}
        onStroke={handleStroke}
      />
      <div className="controls">
        <CompactPicker color={color} onChange={handleColorChange} />

        <select
          className="stroke-width-select"
          value={strokeWidth}
          onChange={handleStrokeWidthChange}
        >
          <option value={2}>Thin (2px)</option>
          <option value={4}>Normal (4px)</option>
          <option value={8}>Thick (8px)</option>
          <option value={12}>Extra Thick (12px)</option>
        </select>

        <button className="Erase-Button" onClick={handleErase}>
          Erase Canvas
        </button>
      </div>
    </div>
  );
}

export default App;
