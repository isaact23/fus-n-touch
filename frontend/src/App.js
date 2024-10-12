import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { CompactPicker } from 'react-color';
import { useState, useRef } from 'react';
import { genImage } from './image-gen';

function App() {
  const [color, setColor] = useState("pink");
  const [timeoutId, setTimeoutId] = useState(null); // Track the timeout
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null); // State to store the generated image URL
  const canvasRef = useRef(); // Ref for the sketch canvas

  const handleColorChange = (colorObj) => {
    setColor(colorObj.hex); // Extract hex value from the color object
  };

  const handleStroke = () => {
    if (timeoutId) clearTimeout(timeoutId); // Clear previous timeout

    const newTimeoutId = setTimeout(() => {
      saveImage(); // Save image after 10s of inactivity
    }, 5000);

    setTimeoutId(newTimeoutId); // Store timeout ID
  };

  const saveImage = async () => {
    let base64Image = null;
    try {
      base64Image = await canvasRef.current.exportImage('png'); // Get base64 image
    } catch (error) {
      console.error('Error exporting image:', error);
      return;
    }

    genImage(base64Image)
      .then(url => {
        console.log('Generated Image URL:', url);
        setGeneratedImageUrl(url); // Set the generated image URL
      })
      .catch(err => {
        console.error('Error generating image:', err);
      });
  };

  const handleErase = () => {
    canvasRef.current.clearCanvas(); // Clear the sketch canvas
  };

  const handleBackToCanvas = () => {
    setGeneratedImageUrl(null); // Reset the image URL to go back to the sketch canvas
  };

  return (
    <div className="App-header">
      <h1>Fuse-N-Touch</h1>

      {generatedImageUrl ? (
        <>
          {/* Render the image if the URL is generated */}
          <img src={generatedImageUrl} alt="Generated" className="generated-image" />
          {/* Button to go back to the sketch canvas */}
          <button className="back-button" onClick={handleBackToCanvas}>
            Back to Sketch Canvas
          </button>
        </>
      ) : (
        <>
          {/* Render the sketch canvas if the image has not been generated */}
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
        </>
      )}
    </div>
  );
}

export default App;
