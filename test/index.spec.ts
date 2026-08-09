import { expect } from 'aegir/chai'
import { isLoopbackAddr } from '../src/index.ts'

/**
 * Table-driven so a failure names the offending address.
 * Grouped by the reason each case exists.
 */
const cases: Array<[string, boolean, string]> = [
  // ---- IPv6 loopback, every spelling RFC 4291 permits (issue #102) ----
  ["::1", true, "canonical"],
  ["0:0:0:0:0:0:0:1", true, "fully expanded"],
  ["0000:0000:0000:0000:0000:0000:0000:0001", true, "zero-padded"],
  ["::0001", true, "padded, compressed"],
  ["0:0:0:0:0:0:0:0001", true, "expanded, padded"],
  ["0:0:0:0:0:0:0:01", true, "expanded, padded"],
  ["::01", true, "padded, compressed"],
  ["::00001", false, "five hex digits is not valid IPv6"],

  // ---- IPv6 non-loopback ----
  ["::", false, "unspecified, not loopback"],
  ["::0", false, "unspecified"],
  ["::2", false, "not loopback"],
  ["fe80::1", false, "link-local"],
  ["2001:db8::1", false, "documentation range"],
  ["2001:8a0:7ac5:4201:3ac9:86ff:fe31:7095", false, "global unicast"],
  ["::ffff:127.0.0.1", false, "IPv4-mapped is neither 127.0.0.0/8 nor ::1/128"],

  // ---- IPv4 loopback, canonical and alternative spellings ----
  ["127.0.0.1", true, "canonical"],
  ["127.1.0.1", true, "anywhere in 127/8"],
  ["127.1.1.0", true, "anywhere in 127/8"],
  ["127.255.255.255", true, "top of 127/8"],
  ["127.000.000.001", true, "zero-padded"],
  ["127.1", true, "shorthand, normalises to 127.0.0.1"],
  ["127.0.1", true, "shorthand"],
  ["2130706433", true, "decimal"],
  ["0x7f000001", true, "hexadecimal"],
  ["0177.0.0.1", true, "octal first octet"],

  // ---- IPv4 non-loopback ----
  ["10.0.0.0", false, "private, not loopback"],
  ["10.1.1.1", false, "private"],
  ["10.255.255.255", false, "private"],
  ["172.16.0.0", false, "private"],
  ["172.31.255.255", false, "private"],
  ["192.168.0.0", false, "private"],
  ["192.168.255.255", false, "private"],
  ["164.101.185.82", false, "public"],
  ["226.84.185.150", false, "multicast"],
  ["255.38.207.121", false, "public"],
  ["71.12.102.112", false, "public"],
  ["128.0.0.1", false, "adjacent to 127/8"],
  ["27.0.0.1", false, "prefix trap"],
  ["1127.0.0.1", false, "prefix trap"],

  // ---- not addresses at all ----
  ["127.999.999.999", false, "octets out of range"],
  ["127.256.0.1", false, "octet > 255"],
  ["localhost", false, "hostname, not an address"],
  ["", false, "empty"],
  ["not an ip", false, "garbage"],

  // ---- domains that merely begin with "127." (review, src/index.ts:30) ----
  // The URL parser only yields a dotted quad when the host ends in a number,
  // so these are parsed as DOMAINS and returned verbatim. A '127.' prefix test
  // would pass them, which fails open: an attacker-registrable name would read
  // as loopback.
  ["127.example.com", false, "domain, attacker-registrable"],
  ["127.0.0.1.example.com", false, "domain"],
  ["127.foo", false, "domain"],

  // ---- URL delimiters live in the input (review, src/index.ts:20) ----
  // '@', '/', '?' and '#' terminate or relocate the host, and ']' escapes the
  // brackets added for IPv6.
  ["foo@127.0.0.1", false, "userinfo would be stripped"],
  ["127.0.0.1/../x", false, "path would be discarded"],
  ["::1]/@evil.com", false, "bracket escape"],
  ["127.0.0.1?x=1", false, "query"],
  ["127.0.0.1#frag", false, "fragment"],
  ["127.0.0.1:8080", false, "port is not part of the address"],

  // ---- ASCII whitespace is stripped by the URL parser (review, src/index.ts:7) ----
  ["127.0.0\t.1", false, "tab would be stripped before parsing"],
  ["127.0.0\n.1", false, "LF would be stripped"],
  ["127.0.0\r.1", false, "CR would be stripped"]
]

describe('is-loopback-addr', () => {
  for (const [input, expected, why] of cases) {
    it(`${JSON.stringify(input)} -> ${expected} (${why})`, () => {
      expect(isLoopbackAddr(input)).to.eql(expected)
    })
  }
})
