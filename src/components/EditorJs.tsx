import React, { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import Quote from '@editorjs/quote';
// @ts-ignore
import Delimiter from '@editorjs/delimiter';
// @ts-ignore
import InlineCode from '@editorjs/inline-code';
// @ts-ignore
import Table from '@editorjs/table';
// @ts-ignore
import Checklist from '@editorjs/checklist';
import { 
  Heading, 
  List as ListIcon, 
  Quote as QuoteIcon, 
  CheckSquare, 
  Table as TableIcon, 
  Image as ImageIcon, 
  Minus, 
  Code,
  Sparkles,
  RefreshCw,
  Eye,
  Edit3
} from 'lucide-react';

interface EditorJsProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  holderId?: string;
}

export default function EditorJs({
  data,
  onChange,
  placeholder = 'Write your memorial guide, liturgical reflection, or family article here...',
  readOnly = false,
  minHeight = 350,
  holderId = 'editorjs-container',
}: EditorJsProps) {
  const editorInstanceRef = useRef<EditorJS | null>(null);
  const isMountedRef = useRef<boolean>(false);
  const [isReady, setIsReady] = useState(false);
  const [activeBlockCount, setActiveBlockCount] = useState(data?.blocks?.length || 0);

  useEffect(() => {
    isMountedRef.current = true;

    async function initEditor() {
      if (editorInstanceRef.current) {
        try {
          await editorInstanceRef.current.isReady;
          editorInstanceRef.current.destroy();
          editorInstanceRef.current = null;
        } catch (e) {
          console.warn('Editor destroy cleanup:', e);
        }
      }

      const editor = new EditorJS({
        holder: holderId,
        placeholder,
        readOnly,
        minHeight,
        data: data || { blocks: [] },
        tools: {
          header: {
            class: Header as any,
            inlineToolbar: ['link', 'bold', 'italic'],
            config: {
              placeholder: 'Enter a section heading...',
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List as any,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
          quote: {
            class: Quote as any,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter comforting quote or scripture...',
              captionPlaceholder: 'Quote author, hymn, or chapter reference...',
            },
          },
          checklist: {
            class: Checklist as any,
            inlineToolbar: true,
          },
          table: {
            class: Table as any,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          delimiter: Delimiter as any,
          inlineCode: InlineCode as any,
        },
        async onChange(api) {
          if (onChange && isMountedRef.current) {
            try {
              const output = await api.saver.save();
              setActiveBlockCount(output.blocks.length);
              onChange(output);
            } catch (error) {
              console.error('EditorJS save error:', error);
            }
          }
        },
        onReady() {
          if (isMountedRef.current) {
            setIsReady(true);
          }
        },
      });

      editorInstanceRef.current = editor;
    }

    initEditor();

    return () => {
      isMountedRef.current = false;
      if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [holderId]);

  // Quick Preset Insertion Helpers
  const insertBlock = async (type: string, blockData: any) => {
    if (!editorInstanceRef.current) return;
    try {
      await editorInstanceRef.current.isReady;
      const currentBlocks = await editorInstanceRef.current.save();
      const newBlocks = [...currentBlocks.blocks, { type, data: blockData }];
      await editorInstanceRef.current.render({
        ...currentBlocks,
        blocks: newBlocks,
      });
      if (onChange) {
        onChange({ ...currentBlocks, blocks: newBlocks });
      }
      setActiveBlockCount(newBlocks.length);
    } catch (e) {
      console.error('Failed to insert block:', e);
    }
  };

  const addSampleImage = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    ];
    const chosen = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    insertBlock('paragraph', {
      text: `<img src="${chosen}" alt="Memorial Presentation" style="width:100%; border-radius:16px; margin: 16px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.08);" /><em style="display:block; text-align:center; font-size:12px; color:#94a3b8;">High-resolution keepsake stationery spread</em>`,
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all">
      {/* Top Quick Actions Bar (if not readOnly) */}
      {!readOnly && (
        <div className="bg-[#FAF8F5] border-b border-[#E2E8F0] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-[#967440] uppercase tracking-wider mr-2 flex items-center gap-1">
              <Sparkles size={12} />
              Quick Insert:
            </span>
            <button
              type="button"
              onClick={() => insertBlock('header', { text: 'New Section Title', level: 2 })}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2C1810] bg-white hover:bg-amber-50 hover:text-[#967440] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
            >
              <Heading size={12} /> Heading
            </button>
            <button
              type="button"
              onClick={() => insertBlock('list', { style: 'unordered', items: ['First key memorial detail', 'Second ceremony element'] })}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2C1810] bg-white hover:bg-amber-50 hover:text-[#967440] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
            >
              <ListIcon size={12} /> List
            </button>
            <button
              type="button"
              onClick={() => insertBlock('quote', { text: 'Those we love never truly leave us. They live on in the kindness they shared.', caption: 'Memorial Blessing' })}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2C1810] bg-white hover:bg-amber-50 hover:text-[#967440] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
            >
              <QuoteIcon size={12} /> Quote
            </button>
            <button
              type="button"
              onClick={() => insertBlock('checklist', { items: [{ text: 'Order proof review complete', checked: true }, { text: 'Chapel music verified', checked: false }] })}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2C1810] bg-white hover:bg-amber-50 hover:text-[#967440] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
            >
              <CheckSquare size={12} /> Checklist
            </button>
            <button
              type="button"
              onClick={() => insertBlock('table', { withHeadings: true, content: [['Service Item', 'Speaker/Officiant', 'Duration'], ['Opening Hymn', 'Choir', '4 mins'], ['Eulogy', 'Family Member', '8 mins']] })}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2C1810] bg-white hover:bg-amber-50 hover:text-[#967440] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
            >
              <TableIcon size={12} /> Table
            </button>
            <button
              type="button"
              onClick={addSampleImage}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2C1810] bg-white hover:bg-amber-50 hover:text-[#967440] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
            >
              <ImageIcon size={12} /> Photo
            </button>
            <button
              type="button"
              onClick={() => insertBlock('delimiter', {})}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2C1810] bg-white hover:bg-amber-50 hover:text-[#967440] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
            >
              <Minus size={12} /> Divider
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium">
            <span className="bg-amber-100 text-[#967440] px-2 py-0.5 rounded-full font-bold">
              {activeBlockCount} Blocks
            </span>
            <span className="text-gray-400">Editor.js Active</span>
          </div>
        </div>
      )}

      {/* Main Block Container */}
      <div className="p-6 sm:p-8 min-h-[300px] prose max-w-none text-[#1E293B] font-serif">
        <div id={holderId} className="editorjs-wrapper" />
      </div>

      {/* Subtle Bottom Status Bar */}
      <div className="bg-[#FAF8F5] border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-between text-[11px] text-[#64748B]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Clean JSON block output &bull; Direct Supabase sync</span>
        </div>
        <span className="text-gray-400 italic">Press Tab or click '+' inside editor to browse all block tools</span>
      </div>
    </div>
  );
}
