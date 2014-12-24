
# onpm [![Build Status](https://travis-ci.org/GochoMugo/onpm.svg?branch=develop)](https://travis-ci.org/GochoMugo/onpm) [![Coverage Status](https://img.shields.io/coveralls/GochoMugo/onpm.svg)](https://coveralls.io/r/GochoMugo/onpm?branch=develop) [![Dependency Status](https://gemnasium.com/GochoMugo/onpm.svg)](https://gemnasium.com/GochoMugo/onpm)

Offline Node Package Manager

A simple easy-to-use wrapper for managing and installing different
versions of Node.js packages locally.


## stats

|aspect|detail|
|-------|-------:|
|Stable Version|0.0.0-alpha.1.0|
|Node|0.11, 0.10|
|OS Support|Linux, Windows|

> If _ALL_ tests run well on your machine and suffers no adverse problems,
> you may request it be added to the compatability list above.


## installation

Latest, Stable: `⇒ [sudo] npm install --global onpm`

Lastest, Not-So-Stable: `⇒ [sudo] npm install --global git+https://github.com/GochoMugo/onpm.git#develop`


## basic usage

__Installing packages has never been easier__.

If a package you installing has not yet been stored in cache, it will be
 installed using npm.

```bash
⇒ onpm express

[09:26:15] info:      processing packages
[09:26:15] info:      installing: express@latest
[09:26:15] warning:   not in cache. installing using npm: express@latest
[09:26:52] info:      installed into node_modules: express@latest
[09:26:53] info:      stored into cache: express@latest
```

Once it is stored in cache, you can install it again directly from cache.

```bash
⇒  onpm install express
[09:33:13] info:      processing packages
[09:33:13] info:      installing: express@latest
[09:33:14] info:      installed into node_modules: express@latest
```

You can also have it saved to the project's `package.json`.
```bash
⇒  onpm install express --save


```


## help information

```bash
⇒  onpm help
OFFLINE Node Package Manager

 help             show this help information
 install <pkg>    install packages from cache/registry
 upgrade          upgrade ONPM itself
 version          show version information

See https://github.com/GochoMugo/onpm for more information
```


## contribution

We believe in this [git branching model][git-branch], so please adhere.


## license

The MIT License (MIT)

Copyright (c) 2014 Gocho Mugo <mugo@forfuture.co.ke>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.


[git-branch]:http://nvie.com/posts/a-successful-git-branching-model "Git-Branching Model"
