/**
 * Anti-XSS Sanitizer Utility
 * Sanitizes rich text and user input before rendering in dangerouslySetInnerHTML
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';
  
  // 1. Strip script tags and their content
  let clean = dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 2. Strip dangerous embedding elements
  clean = clean.replace(/<\/?(iframe|object|embed|form|link|meta|base|applet|style)[^>]*>/gi, '');
  
  // 3. Strip inline event handlers (e.g. onerror, onload, onclick, onmouseover)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
  
  // 4. Disarm javascript: pseudo-protocols
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>]*/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*["']?\s*javascript:[^"'>]*/gi, 'src=""');
  
  return clean;
}
