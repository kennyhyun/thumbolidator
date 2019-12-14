# Thumbolidator

> Thumbnail image consolidator

This is still a proof of concept. Please don't use in any serious project.

[![NPM](https://img.shields.io/npm/v/thumbolidator.svg)](https://www.npmjs.com/package/thumbolidator) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Concept

Jpegtran can merge jpeg files into a big jpeg file. This will help reduce downloading many number of jpeg files through http.

There are two versions of the thumbnails. Micro and Thumbo. The Thumbo react component shows a micro thumbnail while getting thumbnails.

## Install

```bash
npm install --save thumbolidator
```

## Usage

### Server-side script

```bash
$ ./scripts/thumbolidate.sh ./public/images/2019-11-23/
```

### React component

```jsx
import React, { Component } from 'react'

import { Thumbo } from 'thumbolidator'

class Example extends Component {
  render () {
    return (
      <Thumbo src="http://localhost/images" size={64} />
    )
  }
}
```

### Running example in your local environment

Needs Docker

Put some image files in `public` directory with sub-directories.

```bash
$ ./scripts/thumbolidate.sh ./public/images1
$ ./scripts/thumbolidate.sh ./public/images2
$ docker-compose up -d
$ cd example
$ npm start
```

## Todos and limitations

- Paging `.thumboldate` files
  - There is a maximum number of images in the directory
- build `jpegtran` binary using gyp
  - currently runs only in Linux/Mac and might not run in some environment
- Needs a web-server setting to return `.thumbolidate` file for the directory
- Cannot remove memoized cache
  - To manage cache for memory usage

## License

MIT © [kennyhyun](https://github.com/kennyhyun)
