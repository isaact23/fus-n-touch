import './App.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';

function App() {

  return (
    <div className="App">
      <h1> Fuse-N-Touch </h1>
      <ReactSketchCanvas
      style={styles}
      width="600"
      height="400"
      strokeWidth={4}
      strokeColor="red"
    />

    </div>
  );
}

export default App;
