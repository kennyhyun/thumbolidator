import React from 'react';
import './App.css';
import ImageContainer from './imageContainer';

const albumUrls1 = [
  'http://192.168.8.204:8019/2011-11-26%20ip111126/',
  'http://192.168.8.204:8019/2011-11-25/',
  'http://192.168.8.204:8019/2012-05-21/',
  'http://192.168.8.204:8019/iPhotoLibrary.2016/',
  'http://192.168.8.204:8019/ORGDATA/100921_iphone3gs/',
  'http://192.168.8.204:8019/ORGDATA/_BAK_2005/dongwon/050821_dongwon/',
  'http://192.168.8.204:8019/ORGDATA/_BAK_2006/060408/',
];

const albumUrls = [
  'http://localhost:8051/Kenny/',
  'http://localhost:8051/Kenny2/',
  'http://localhost:8051/PhotoKina Demo - 329 Images/',
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
