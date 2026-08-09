# is-loopback-addr

[![Build Status](https://github.com/vasco-santos/is-loopback-addr/actions/workflows/js-test-and-release.yml/badge.svg?branch=main)](https://github.com/vasco-santos/is-loopback-addr/actions/workflows/js-test-and-release.yml)
[![dependencies Status](https://david-dm.org/vasco-santos/is-loopback-addr/status.svg)](https://david-dm.org/vasco-santos/is-loopback-addr)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Downloads](https://img.shields.io/npm/dm/is-loopback-addr.svg)](https://www.npmjs.com/package/is-loopback-addr)
[![Minzipped size](https://badgen.net/bundlephobia/minzip/is-loopback-addr)](https://bundlephobia.com/result?p=is-loopback-addr)
[![codecov](https://img.shields.io/codecov/c/github/vasco-santos/is-loopback-addr.svg?style=flat-square)](https://codecov.io/gh/vasco-santos/is-loopback-addr)

> Check if a IP address is a loopback address

Various Internet Engineering Task Force ([IETF](https://www.ietf.org/)) standards reserve the IPv4 address block `127.0.0.0/8` and the IPv6 address `::1/128` for this purpose. The most common IPv4 address used is 127.0.0.1. Commonly these loopback addresses are mapped to the hostnames, localhost or loopback. For more information check [rfc5735](https://tools.ietf.org/html/rfc5735) and [rfc3513](https://tools.ietf.org/html/rfc3513#section-2.4).

This checks whether a **string is a loopback address literal**, per `127.0.0.0/8` and `::1/128`. It accepts any spelling the platform URL parser canonicalises into those ranges, which includes `127.1`, `2130706433`, `0x7f000001` and `0177.0.0.1`. Hostnames are never resolved: `localhost` is `false`, and `::ffff:127.0.0.1` is `false` because it is in neither range.

**This is not an SSRF filter.** It classifies literals by RFC range. It does not know about DNS, redirects, IPv4-mapped addresses or any other route to the loopback interface, and it should not be the only check between untrusted input and an outbound request.

## Install

```sh
npm i is-loopback-addr
```

## Usage

```js
import { isLoopbackAddr } from 'is-loopback-addr'

console.log(isLoopbackAddr('127.0.0.1')) // true
console.log(isLoopbackAddr('192.168.0.1')) // false
console.log(isLoopbackAddr('22.2.0.1')) // false
console.log(isLoopbackAddr('::1')) // true
console.log(isLoopbackAddr('2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095')) // false
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/vasco-santos/is-loopback-addr/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Vasco Santos