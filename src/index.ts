/**
 * Check if a given ip address is a loopback address
 */
export function isLoopbackAddr (ip: string) {
  if (typeof ip !== 'string' || ip.length === 0) {
    return false
  }

  // The URL parser canonicalises both address families and is available in
  // Node.js, browsers, Deno and Bun. IPv6 literals must be bracketed for it.
  const authority = ip.includes(':') ? `[${ip}]` : ip

  let hostname: string

  try {
    hostname = new URL(`http://${authority}`).hostname
  } catch {
    // Not a parseable address or host at all.
    return false
  }

  // IPv6 comes back bracketed and fully compressed, so every spelling of the
  // loopback address ('0:0:0:0:0:0:0:1', '::0001', ...) normalises to '[::1]'.
  if (hostname.startsWith('[')) {
    return hostname === '[::1]'
  }

  // IPv4 comes back as a canonical dotted quad, so '127.1' and '127.000.000.001'
  // both normalise to '127.0.0.1', and non-addresses never reach here.
  return hostname.startsWith('127.')
}
