import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Thumbolidator from "../client/thumbolidator";

const { REACT_APP_IMG_ELEM } = process.env;

const cssSize = size => ({
  width: size,
  height: size,
  overflow: "hidden"
});

const borderCss = color => ({
  borderRight: `solid 1px ${color}`,
  borderBottom: `solid 1px ${color}`
});

const parse = (src = "") => {
  const arr = src.split("/");
  const filename = arr.slice(-1)[0];
  const albumUrl = arr.slice(0, -1).join("/");
  return {
    filename,
    albumUrl,
    thumbUrl: `${albumUrl}/thumb/${filename}`
  };
};

export default ({ src, size = 128, cacheburst, idx }) => {
  const [type, showType] = useState("");
  const { thumbUrl, filename, albumUrl } = parse(src);
  const thumbo = new Thumbolidator(albumUrl);
  const { promise: dummyThumboPromise } = thumbo.getDummyThumboElement();
  const { promise: dummyMicroPromise } = thumbo.getDummyMicroElement();

  useEffect(() => {
    dummyMicroPromise.then(() => {
      if (!type) showType("micro");
    });
    dummyThumboPromise.then(() => {
      showType("thumbo");
    });
    return function willUnmount() {
      // unmount
    };
  });

  const imgUrl = type === "thumbo" ? thumbo.thumboUrl : thumbo.microUrl;
  const cssParams = { size, filename };
  const imgStyle =
    type === "thumbo"
      ? thumbo.thumboCss(cssParams)
      : thumbo.microCss(cssParams);

  return !!REACT_APP_IMG_ELEM ? (
    <img
      alt={thumbUrl}
      src={thumbUrl}
      style={{ ...cssSize(size), ...borderCss("lightgreen") }}
    />
  ) : (
    <div style={{ ...cssSize(size), position: "relative" }} title={filename}>
      <img src={imgUrl} style={imgStyle} alt={filename} />
    </div>
  );
};
