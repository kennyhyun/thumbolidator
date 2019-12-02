# Thumbolidator

> Thumbnail image consolidator

See also [React Thumbolidator](https://www.npmjs.com/package/react-thumbolidator)

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
```

## Usage

```bash
$ thumbolidator ./public/images/2019-11-23/
```

## Todos and limitations

- [x] Expose scripts to npm packages
- [ ] Paginating `.thumboldate` files
  - There is a maximum number of images in the directory
- [ ] Building `jpegtran` binary using gyp
  - currently runs only in Linux/Mac and might not run in some environment
- [ ] Add/remove thumbnails

## License

MIT © [kennyhyun](https://github.com/kennyhyun)
