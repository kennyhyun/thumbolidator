import React from 'react';
import { compose, branch, mapProps, renderComponent } from 'recompose';
import fetch from 'fetch-hoc';
import PATH from 'path';

import { Thumbo } from 'thumbolidator';

const resolve = (url, path) => {
  const u = new URL(url || 'http://localhost');
  u.pathname = PATH.join(u.pathname, path.substr(1));
  return u.href;
};

console.log(Thumbo);

const ImageContainer = ({ src = 'http://localhost/images/', data, files = [] }) => {
  const cacheburst = 0; // new Date().getTime();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {files.map(
        (file, idx) =>
          (file[0] !== 'x' && Math.random() >= 0) && (
            <Thumbo key={`thumbo:${file}`} src={resolve(src, file)} cacheburst={cacheburst} size={200}/>
          ),
      )}
    </div>
  );
};

export default compose(
  fetch(({ src }) => src),
  branch(({ loading }) => !!loading, renderComponent(({ src }) => <div>Loading {src}...</div>)),
  branch(
    ({ error }) => !!error,
    renderComponent(props => <div style={{ color: 'red', fontSize: '0.6em' }}>Error while getting {props.src}</div>),
  ),
  mapProps(({ data, ...props }) => {
    const lines = data.split('\n');
    const [, tileSize, gridSize] = lines[0].split(':');
    return {
      ...props,
      files: lines.slice(1),
      data: { tileSize, gridSize },
    };
  }),
)(ImageContainer);
