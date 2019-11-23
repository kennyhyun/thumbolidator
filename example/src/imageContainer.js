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

const ImageContainer = ({ path = 'http://localhost/images/', files = [] }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {files.map(f => (
      <Thumbo key={`thumbo:${f}`} src={resolve(path, f)} size={160} />
    ))}
  </div>
);

export default compose(
  fetch(({ path }) => path),
  branch(({ loading }) => !!loading, renderComponent(({ path }) => <div>Loading {path}...</div>)),
  branch(
    ({ error }) => !!error,
    renderComponent(props => <div style={{ color: 'red', fontSize: '0.6em' }}>Error while getting {props.path}</div>)
  ),
  /* data: thumbolidate meta file */
  mapProps(({ data, loading, error, ...props }) => {
    const lines = data.split('\n');
    return {
      ...props,
      /* remove first line which is comment,
       * if the first char is 'x', it's deleted
       */
      files: lines.slice(1).filter(f => f[0] !== 'x'),
    };
  })
)(ImageContainer);
