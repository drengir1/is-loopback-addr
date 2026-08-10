/**
 * Check if a given ip address is a loopback address
 */
export function isLoopbackAddr (ip: string): boolean {
  // An address literal is hex digits, dots and colons — nothing else. The URL
  // parser normalises anything wider (percent-decoding, IDNA mapping, ASCII
  // whitespace stripping) into a string that can look like a loopback quad.
  if (typeof ip !== 'string' || !/^[0-9a-fA-FxX.:]+$/.test(ip)) {
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
