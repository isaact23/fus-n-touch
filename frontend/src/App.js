import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { CompactPicker } from 'react-color';
import { useState, useRef } from 'react';
import { analyzeImage } from './image-gen';

function App() {
  const [color, setColor] = useState("pink");
  const [timeoutId, setTimeoutId] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isCyberpunk, setIsCyberpunk] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const canvasRef = useRef();

  const handleColorChange = (colorObj) => {
    setColor(colorObj.hex);
  };

  const handleStrokeWidthChange = (event) => {
    setStrokeWidth(parseInt(event.target.value));
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
      console.log('Saved Base64 Image:', base64Image);
    } catch (error) {
      console.error('Error exporting image:', error);
    }

    analyzeImage(base64Image, isCyberpunk)
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
    setIsCyberpunk(!isCyberpunk);
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
            strokeWidth={strokeWidth}
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

