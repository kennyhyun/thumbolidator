# React Thumbolidator

> A React component for Thumbolidator

See also [Thumbolidator](https://www.npmjs.com/package/thumbolidator)

This is still a proof of concept. Please don't use in any serious project.

[![NPM](https://img.shields.io/npm/v/react-thumbolidator.svg)](https://www.npmjs.com/package/react-thumbolidator)

![thumb.micro](https://kennyhyun.github.io/thumbolidator/images/images1/thumb.micro.jpg) [thumb.micro](https://kennyhyun.github.io/thumbolidator/images/images2/thumb.micro.jpg)

Try demo [here](https://kennyhyun.github.io/thumbolidator/)!

## Concept

[Jpegtran](https://jpegclub.org/jpegtran/) can merge jpeg files into a big jpeg file. This will help reduce downloading many number of jpeg files through http.

Jpegtran drop-patch does not re-encode jpegs so thumbnails can be added later on without dropping quality.`

Thumbolidator creates two tiles of the thumbnails, Micro and Thumbo. The `Thumbo` react component will shows a micro thumbnail while loading thumbnails.

## Install

```bash
npm install --save react-thumbolidator
```

## Usage

```jsx
import React, { Component } from 'react'

import { Thumbo } from 'react-thumbolidator'

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

## Todos and limitations

- Needs a web-server setting to return `.thumbolidate` file for the directory
- [x] Support pagination
- [ ] Managing cache for memory usage
  - Cannot remove memoized cache

## License

MIT © [kennyhyun](https://github.com/kennyhyun)
