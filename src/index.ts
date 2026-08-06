/**
 * Check if a given ip address is a loopback address
 */
export function isLoopbackAddr (ip: string): boolean {
  // The URL parser strips every ASCII tab, LF and CR before parsing, so reject
  // them up front — otherwise '127.0.0\t.1' normalises to 127.0.0.1.
  if (typeof ip !== 'string' || ip.length === 0 || /[\t\n\r]/.test(ip)) {
    return false
  }

  // The URL parser canonicalises both address families and is available in
  // Node.js, browsers, Deno and Bun. IPv6 literals must be bracketed for it.
  const authority = ip.includes(':') ? `[${ip}]` : ip

  let url: URL

  try {
    url = new URL(`http://${authority}`)
  } catch {
    // Not a parseable address or host at all.
    return false
  }

  // The argument must have been the whole authority and nothing else — no
  // userinfo, path, query or fragment, and no escape from the brackets added
  // above. Otherwise 'foo@127.0.0.1' and '::1]/@evil.com' parse as loopback.
  if (url.href !== `http://${url.hostname}/`) {
    return false
  }

  const hostname = url.hostname

  // IPv6 comes back bracketed and fully compressed, so every spelling of the
  // loopback address ('0:0:0:0:0:0:0:1', '::0001', ...) normalises to '[::1]'.
  if (hostname.startsWith('[')) {
    return hostname === '[::1]'
  }

  // IPv4 comes back as a canonical dotted quad, so '127.1' and '127.000.000.001'
  // both normalise to '127.0.0.1'. A host that does not end in a number is
  // parsed as a *domain* and returned verbatim ('127.example.com'), so require a
  // real dotted quad rather than a '127.' prefix.
  const parts = hostname.split('.')

  return parts.length === 4 &&
    parts[0] === '127' &&
    parts.every(part => /^\d{1,3}$/.test(part))
}
