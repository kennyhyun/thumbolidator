import React from 'react';
import './App.css';
import ImageContainer from './imageContainer';

const { PUBLIC_URL = '', REACT_APP_BASE_URL = window ? window.location.origin : '//localhost' } = process.env;

const albumUrls = [
  `${REACT_APP_BASE_URL}${PUBLIC_URL}/images/images1`,
  `${REACT_APP_BASE_URL}${PUBLIC_URL}/images/images2`,
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {albumUrls.map((url = '') => (
          /* A React Component to show all the images in the path */
          <ImageContainer key={url} path={url} />
        ))}
      </header>
    </div>
  );
}

export default App;
