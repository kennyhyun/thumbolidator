# Thumbolidator

> Thumbnail image consolidator

This is still a proof of concept. Please don't use in any serious project.

[![NPM](https://img.shields.io/npm/v/thumbolidator.svg)](https://www.npmjs.com/package/thumbolidator)

![thumb.micro](https://kennyhyun.github.io/thumbolidator/images/images1/thumb.micro.jpg) ![thumb.micro](https://kennyhyun.github.io/thumbolidator/images/images2/thumb.micro.jpg)

Try demo [here](https://kennyhyun.github.io/thumbolidator/)!

## Concept

[Jpegtran](https://jpegclub.org/jpegtran/) can merge jpeg files into a big jpeg file. This will help reduce downloading many number of jpeg files through http.

Jpegtran drop-patch does not re-encode jpegs so thumbnails can be added later on without dropping quality.`

Thumbolidator creates two tiles of the thumbnails, Micro and Thumbo. The `Thumbo` react component will shows a micro thumbnail while loading thumbnails.

## Install

```bash
npm install -g thumbolidator
npm install --save react-thumbolidator
```

## Usage

### Server-side script

```bash
$ thumbolidator ./public/images/2019-11-23/
```

### React component

```jsx
import React, { Component } from 'react'

import { Thumbo } from 'thumbolidator'

class Example extends Component {
  render ({ files }) {
    return (
      <>
        {files.map(file => (
          <Thumbo src={`http://localhost/images/${file}`} key={file} size={64} />
        ))}
      </>
    )
  }
}
```

### Running example in your local environment

Needs Docker

Put some image files in `public` directory with sub-directories.

```bash
$ thumbolidator ./public/images1
$ thumbolidator ./public/images2
$ docker-compose up -d
$ cd example
$ npm start
```

## See also

- [React thumbolidator](https://github.com/kennyhyun/thumbolidator/blob/master/react/README.md)
- [thumbolidator](https://github.com/kennyhyun/thumbolidator/blob/master/scripts/README.md)

## License

MIT © [kennyhyun](https://github.com/kennyhyun)
