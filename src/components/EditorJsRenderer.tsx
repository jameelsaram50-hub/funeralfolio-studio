import React from 'react';
import { 
  Quote as QuoteIcon, 
  CheckSquare, 
  Square, 
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import { EditorJsOutput, EditorJsBlock } from '../types';
import { sanitizeHtml } from '../lib/sanitize';

interface EditorJsRendererProps {
  content?: EditorJsOutput | any;
  className?: string;
}

export default function EditorJsRenderer({ content, className = '' }: EditorJsRendererProps) {
  if (!content) {
    return <p className="text-gray-400 italic">No article content available.</p>;
  }

  // Handle both Editor.js OutputData and legacy BlockNote node arrays if present
  const blocks: EditorJsBlock[] = Array.isArray(content)
    ? content.map((node: any) => {
        if (node.type === 'heading') {
          return {
            type: 'header',
            data: {
              text: node.content?.map((c: any) => c.text).join('') || '',
              level: node.props?.level || 2,
            },
          };
        }
        if (node.type === 'paragraph') {
          return {
            type: 'paragraph',
            data: {
              text: node.content?.map((c: any) => c.text).join('') || '',
            },
          };
        }
        if (node.type === 'bulletListItem') {
          return {
            type: 'list',
            data: {
              style: 'unordered',
              items: [node.content?.map((c: any) => c.text).join('') || ''],
            },
          };
        }
        if (node.type === 'quote') {
          return {
            type: 'quote',
            data: {
              text: node.content?.map((c: any) => c.text).join('') || '',
              caption: '',
            },
          };
        }
        return {
          type: 'paragraph',
          data: { text: node.content?.map((c: any) => c.text).join('') || '' },
        };
      })
    : content.blocks || [];

  if (!blocks || blocks.length === 0) {
    return <p className="text-gray-400 italic">This article is currently being drafted.</p>;
  }

  return (
    <div className={`space-y-6 leading-relaxed font-serif text-[#1E293B] ${className}`}>
      {blocks.map((block, index) => {
        const key = block.id || `block-${index}`;
        const data = block.data || {};

        switch (block.type) {
          case 'header': {
            const level = data.level || 2;
            const text = data.text || '';
            const headingId = text.replace(/<[^>]*>?/gm, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            if (level === 1) {
              return (
                <h1 key={key} id={headingId} className="text-3xl sm:text-4xl font-serif font-bold text-[#2C1810] tracking-tight mt-10 mb-4 scroll-mt-28">
                  <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />
                </h1>
              );
            }
            if (level === 2) {
              return (
                <h2 key={key} id={headingId} className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1810] tracking-tight mt-10 mb-4 pb-2 border-b border-[#967440]/20 scroll-mt-28 flex items-center justify-between">
                  <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />
                </h2>
              );
            }
            if (level === 3) {
              return (
                <h3 key={key} id={headingId} className="text-xl sm:text-2xl font-serif font-bold text-[#2C1810] mt-7 mb-3 scroll-mt-28">
                  <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />
                </h3>
              );
            }
            return (
              <h4 key={key} id={headingId} className="text-lg sm:text-xl font-serif font-semibold text-[#2C1810] mt-5 mb-2 scroll-mt-28">
                <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />
              </h4>
            );
          }

          case 'paragraph': {
            const text = data.text || '';
            return (
              <p 
                key={key} 
                className="text-base sm:text-lg text-gray-700 leading-relaxed font-serif"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }}
              />
            );
          }

          case 'list': {
            const style = data.style || 'unordered';
            const items = data.items || [];

            if (style === 'ordered') {
              return (
                <ol key={key} className="list-decimal list-outside ml-6 space-y-2.5 my-4 text-base sm:text-lg text-gray-700 font-serif">
                  {items.map((item: any, i: number) => {
                    const itemText = typeof item === 'string' ? item : item.content || '';
                    return <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(itemText) }} />;
                  })}
                </ol>
              );
            }

            return (
              <ul key={key} className="list-disc list-outside ml-6 space-y-2.5 my-4 text-base sm:text-lg text-gray-700 font-serif">
                {items.map((item: any, i: number) => {
                  const itemText = typeof item === 'string' ? item : item.content || '';
                  return <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(itemText) }} />;
                })}
              </ul>
            );
          }

          case 'quote': {
            return (
              <blockquote key={key} className="p-6 my-6 border-l-4 border-[#967440] bg-[#FAF8F5] rounded-r-2xl font-serif italic text-lg sm:text-xl text-[#2C1810] shadow-2xs">
                <div className="flex items-start gap-3">
                  <QuoteIcon size={22} className="text-[#967440] shrink-0 mt-1 opacity-60" />
                  <div className="space-y-2">
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.text || '') }} />
                    {data.caption && (
                      <cite className="block text-xs font-sans font-bold uppercase tracking-wider text-[#967440] not-italic mt-2">
                        — {data.caption}
                      </cite>
                    )}
                  </div>
                </div>
              </blockquote>
            );
          }

          case 'checklist': {
            const items = data.items || [];
            return (
              <div key={key} className="my-6 p-5 bg-[#FAF8F5] border border-[#E2E8F0] rounded-2xl space-y-3">
                <p className="text-xs font-sans font-bold text-[#967440] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckSquare size={14} />
                  Memorial Checklist & Planning Step
                </p>
                {items.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-base text-gray-700 font-serif">
                    {item.checked ? (
                      <CheckSquare size={18} className="text-[#967440] shrink-0 mt-1" />
                    ) : (
                      <Square size={18} className="text-gray-400 shrink-0 mt-1" />
                    )}
                    <span 
                      className={item.checked ? 'text-gray-800' : 'text-gray-600'}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.text) }}
                    />
                  </div>
                ))}
              </div>
            );
          }

          case 'table': {
            const content = data.content || [];
            const withHeadings = data.withHeadings ?? false;

            if (content.length === 0) return null;

            return (
              <div key={key} className="my-6 overflow-x-auto rounded-xl border border-[#E2E8F0] shadow-2xs">
                <table className="min-w-full divide-y divide-[#E2E8F0] font-sans text-sm">
                  {withHeadings && (
                    <thead className="bg-[#FAF8F5]">
                      <tr>
                        {content[0].map((head: string, hi: number) => (
                          <th key={hi} className="px-4 py-3 text-left font-bold text-[#2C1810]">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {(withHeadings ? content.slice(1) : content).map((row: string[], ri: number) => (
                      <tr key={ri} className="hover:bg-amber-50/40 transition-colors">
                        {row.map((cell: string, ci: number) => (
                          <td key={ci} className="px-4 py-3 text-gray-700 font-serif">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case 'delimiter': {
            return (
              <div key={key} className="py-6 flex items-center justify-center gap-3 text-[#967440]">
                <span className="w-12 h-px bg-[#967440]/30" />
                <Sparkles size={16} />
                <span className="w-12 h-px bg-[#967440]/30" />
              </div>
            );
          }

          case 'image': {
            const url = data.file?.url || data.url || '';
            if (!url) return null;

            return (
              <figure key={key} className="my-8 text-center">
                <img 
                  src={url} 
                  alt={data.caption || 'Memorial Guide Visual'} 
                  className={`w-full rounded-2xl shadow-md mx-auto ${data.withBorder ? 'border-4 border-[#967440]/20' : ''}`}
                />
                {data.caption && (
                  <figcaption className="text-xs font-sans text-gray-500 mt-2.5 italic">
                    {data.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
