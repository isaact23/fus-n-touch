import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { CompactPicker } from 'react-color';
import { useState, useRef, useEffect } from 'react';
import { analyzeImage } from './image-gen';

function App() {
  const [color, setColor] = useState("pink");
  const [timeoutId, setTimeoutId] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isCyberpunk, setIsCyberpunk] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);  // Tracks image generation
  const [funFact, setFunFact] = useState('');
  const [countdown, setCountdown] = useState(0);            // Countdown for stroke timer
  const canvasRef = useRef();

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  const handleColorChange = (colorObj) => {
    setColor(colorObj.hex);
  };

  const handleStrokeWidthChange = (event) => {
    setStrokeWidth(parseInt(event.target.value));
  };

  const handleStroke = () => {
    if (timeoutId) clearTimeout(timeoutId);

    setCountdown(5); // Start countdown from 5 seconds

    const newTimeoutId = setTimeout(() => {
      saveImage();
    }, 5000);

    setTimeoutId(newTimeoutId);
  };

  const saveImage = async () => {
    if (isGenerating) return; // Prevent multiple calls while generating
    setIsGenerating(true);    // Set generating flag to true

    let base64Image = null;
    try {
      base64Image = await canvasRef.current.exportImage('png');
    } catch (error) {
      console.error('Error exporting image:', error);
    }

    analyzeImage(base64Image, isCyberpunk)
      .then(result => {
        console.log('Generated Image URL:', result.url);
        console.log('Fun Fact:', result.fact);
        setGeneratedImageUrl(result.url);
        setFunFact(result.fact);
      })
      .catch(err => {
        console.error('Error generating image:', err);
      })
      .finally(() => {
        setIsGenerating(false); // Reset generating flag after completion
        setCountdown(0);        // Clear the countdown after generation
      });
  };

  const handleErase = () => {
    canvasRef.current.clearCanvas();
    if (timeoutId) clearTimeout(timeoutId);
    setCountdown(0); // Reset the countdown if the canvas is cleared
  };

  const handleBackToCanvas = () => {
    setGeneratedImageUrl(null);
  };

  const toggleCyberpunk = () => {
    setIsCyberpunk(!isCyberpunk);
  };

  return (
    <div className="App-header">
      {generatedImageUrl ? (
        <>
          <img src={generatedImageUrl} alt="Generated" className="Generated-Image" />
          <p>{funFact}</p>
          <button className="Back-Button" onClick={handleBackToCanvas}>
            Back to Sketch Canvas
          </button>
        </>
      ) : (
        <>
          <ReactSketchCanvas
            ref={canvasRef}
            width="100%"
            height="800px"
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
            <div className="timer">
              {countdown > 0 && <p>Saving image in {countdown} seconds...</p>}
            </div>
          </div>

          {isGenerating && (
            <div className="generating">
              <p>Generating Image...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
