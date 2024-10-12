import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { CompactPicker } from 'react-color';
import { useState, useRef } from 'react';
import { analyzeImage } from './image-gen';

function App() {
  const [color, setColor] = useState("pink");
  const [timeoutId, setTimeoutId] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isCyberpunk, setIsCyberpunk] = useState(false); // State for cyberpunk theme
  const canvasRef = useRef();

  const handleColorChange = (colorObj) => {
    setColor(colorObj.hex);
  };

  const handleStroke = () => {
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      saveImage();
    }, 5000);

    setTimeoutId(newTimeoutId);
  };

  const saveImage = async () => {
    let base64Image = null;
    try {
      base64Image = await canvasRef.current.exportImage('png');
    } catch (error) {
      console.error('Error exporting image:', error);
      return;
    }

    analyzeImage(base64Image, isCyberpunk) // Pass cyberpunk state as argument
      .then(result => {
        console.log('Generated Image URL:', result.url);
        console.log('Fun Fact:', result.fact);
        setGeneratedImageUrl(result.url);
      })
      .catch(err => {
        console.error('Error generating image:', err);
      });
  };

  const handleErase = () => {
    canvasRef.current.clearCanvas();
  };

  const handleBackToCanvas = () => {
    setGeneratedImageUrl(null);
  };

  const toggleCyberpunk = () => {
    setIsCyberpunk(!isCyberpunk); // Toggle cyberpunk theme
  };

  return (
    <div className="App-header">
      <h1>Fuse-N-Touch</h1>

      {generatedImageUrl ? (
        <>
          <img src={generatedImageUrl} alt="Generated" className="generated-image" />
          <button className="back-button" onClick={handleBackToCanvas}>
            Back to Sketch Canvas
          </button>
        </>
      ) : (
        <>
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
            <label>
              <input
                type="checkbox"
                checked={isCyberpunk}
                onChange={toggleCyberpunk}
              />
              Cyberpunk Theme
            </label>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
