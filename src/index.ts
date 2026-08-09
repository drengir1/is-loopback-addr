/**
 * Check if a given ip address is a loopback address
 */
export function isLoopbackAddr (ip: string): boolean {
  // Address literals are printable ASCII. Anything else is rejected before
  // parsing: the URL parser strips ASCII whitespace and C0 controls (so
  // '127.0.0\t.1' and '127.0.0.1 ' would normalise to loopback) and applies
  // IDNA mapping (so '１２７.0.0.1' would too).
  if (typeof ip !== 'string' || ip.length === 0 || /[^\x21-\x7e]/.test(ip)) {
    return false
  }

  // URL delimiters must not be present at all: they terminate or relocate the
  // host ('foo@127.0.0.1', '127.0.0.1/../x'), and ']' escapes the brackets
  // added below. A bare trailing '/' or '\' is not part of an address either.
  if (/[/\\?#@[\]]/.test(ip)) {
    return false
  }

  const authority = ip.includes(':') ? `[${ip}]` : ip

  let url: URL
  try {
    url = new URL(`http://${authority}`)
  } catch {
    return false
  }

  // The parsed authority must be the whole input and nothing else.
  if (url.href !== `http://${url.hostname}/`) {
    return false
  }

  const hostname = url.hostname

  if (hostname.startsWith('[')) {
    return hostname === '[::1]'
  }

  // Only a real dotted quad counts. The parser returns domains verbatim, so a
  // '127.' prefix test would accept attacker-registrable names like
  // '127.example.com'.
  const parts = hostname.split('.')
  return parts.length === 4 &&
    parts[0] === '127' &&
    parts.every(part => /^\d{1,3}$/.test(part))
}
