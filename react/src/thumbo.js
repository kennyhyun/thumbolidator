import React from 'react';
import PropTypes from 'prop-types';
import { getThumbolidator } from './thumbolidator';

const { REACT_APP_IMG_ELEM } = process.env;

const cssSize = size => ({
  width: size,
  height: size,
  overflow: 'hidden',
});

const borderCss = color => ({
  borderRight: `solid 1px ${color}`,
  borderBottom: `solid 1px ${color}`,
});

const parse = (src = '') => {
  const arr = src.split('/');
  const filename = arr.slice(-1)[0];
  const albumUrl = arr.slice(0, -1).join('/');
  return {
    filename,
    albumUrl,
    thumbUrl: `${albumUrl}/thumb/${filename}`,
  };
};

export default class Thumbo extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    size: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = { type: '' };
    const { thumbUrl, filename, albumUrl } = parse(props.src);
    this.thumbo = getThumbolidator(albumUrl);
    this.thumbUrl = thumbUrl;
    this.filename = filename;
  }

  componentDidMount() {
    const { promise: dummyThumboPromise } = this.thumbo.getDummyThumboElement();
    const { promise: dummyMicroPromise } = this.thumbo.getDummyMicroElement();
    dummyMicroPromise.then(() => {
      if (!this.type) this.setState({ type: 'micro' });
    });
    dummyThumboPromise.then(() => {
      this.setState({ type: 'thumbo' });
    });
  }

  render() {
    const {
      thumbo,
      state: { type },
      filename,
      thumbUrl,
    } = this;
    const { size = 128 } = this.props;
    const imgUrl = type === 'thumbo' ? thumbo.thumboUrl : thumbo.microUrl;
    const cssParams = { size, filename };
    const imgStyle = type === 'thumbo' ? thumbo.thumboCss(cssParams) : thumbo.microCss(cssParams);

    return REACT_APP_IMG_ELEM ? (
      <img alt={thumbUrl} src={thumbUrl} style={{ ...cssSize(size), ...borderCss('lightgreen') }} />
    ) : (
      <div style={{ ...cssSize(size), position: 'relative' }} title={filename}>
        <img src={imgUrl} style={imgStyle} alt={filename} />
      </div>
    );
  }
}
