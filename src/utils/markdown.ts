/**
 * Minimal markdown renderer for AI-generated report sections. Deliberately
 * narrow in scope (bold, headings, bullet/numbered lists, paragraphs) —
 * this is not a general-purpose markdown parser, just enough to make LLM
 * output readable both on-screen and inside the exported PDF.
 */
export function formatMarkdownLite(markdown: string): string {
  if (!markdown || !markdown.trim()) {
    return '<p style="color:#9AA0AC; font-style:italic;">No content was returned for this section.</p>';
  }

  const escaped = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const withInlineBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const lines = withInlineBold.split('\n');
  const htmlParts: string[] = [];
  let listBuffer: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listBuffer.length && listType) {
      htmlParts.push(`<${listType} style="margin:6px 0 12px 0; padding-left:22px;">${listBuffer.join('')}</${listType}>`);
    }
    listBuffer = [];
    listType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    const headingMatch = line.match(/^#{1,4}\s+(.*)$/);
    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.*)$/);

    if (headingMatch) {
      flushList();
      htmlParts.push(`<h4 style="margin:14px 0 6px 0; font-size:15px; font-weight:600;">${headingMatch[1]}</h4>`);
    } else if (bulletMatch) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listBuffer.push(`<li style="margin:3px 0;">${bulletMatch[1]}</li>`);
    } else if (numberedMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listBuffer.push(`<li style="margin:3px 0;">${numberedMatch[1]}</li>`);
    } else {
      flushList();
      htmlParts.push(`<p style="margin:6px 0; line-height:1.6;">${line}</p>`);
    }
  }
  flushList();

  return htmlParts.join('\n');
}
