import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { TEMPLATES } from '../constants';

export interface ExportOptions {
  filename?: string;
  format?: 'pdf' | 'png';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
}

/**
 * Converts any image URL to a local base64 Data URL to guarantee zero canvas tainting.
 */
async function toSafeDataUrl(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith('data:')) return src;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(src, { mode: 'cors', signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Failed to fetch image');
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const timer = setTimeout(() => resolve(null), 1500);
      img.onload = () => {
        clearTimeout(timer);
        try {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth || 600;
          c.height = img.naturalHeight || 800;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(c.toDataURL('image/jpeg', 0.9));
            return;
          }
        } catch {
          // ignore
        }
        resolve(null);
      };
      img.onerror = () => {
        clearTimeout(timer);
        resolve(null);
      };
      img.src = src;
    });
  }
}

/**
 * Loads an Image safely from a Data URL.
 */
function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!dataUrl) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

/**
 * Downloads a jsPDF document as a clean named .pdf file.
 */
export function savePdfDocument(pdf: jsPDF, filename: string) {
  const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  
  try {
    // 1. Direct Data URI Download (pure client side, instant, never creates a blob UUID)
    const pdfDataUri = pdf.output('datauristring');
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = pdfDataUri;
    a.download = cleanFilename;
    a.setAttribute('download', cleanFilename);
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 2000);
  } catch (err) {
    console.warn('Direct Data URI download failed, using hidden iframe server download:', err);
    try {
      const pdfBase64 = pdf.output('datauristring');
      
      let iframe = document.getElementById('pdf-download-frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'pdf-download-frame';
        iframe.name = 'pdf-download-frame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/download-pdf';
      form.target = 'pdf-download-frame';
      form.style.display = 'none';

      const inputBase64 = document.createElement('input');
      inputBase64.type = 'hidden';
      inputBase64.name = 'pdfBase64';
      inputBase64.value = pdfBase64;
      form.appendChild(inputBase64);

      const inputFilename = document.createElement('input');
      inputFilename.type = 'hidden';
      inputFilename.name = 'filename';
      inputFilename.value = cleanFilename;
      form.appendChild(inputFilename);

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        if (document.body.contains(form)) document.body.removeChild(form);
      }, 2000);
    } catch (e) {
      pdf.save(cleanFilename);
    }
  }
}

/**
 * Downloads a dataURL directly as a file.
 */
export function downloadDataUrl(dataUrl: string, filename: string) {
  try {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = dataUrl;
    a.download = filename;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 1500);
  } catch (err) {
    console.error('Download DataURL error:', err);
  }
}

/**
 * Generates an Authentic 300 DPI high-resolution Memorial Card / Program / Poster PDF
 * containing the EXACT customized theme background, portrait photo, and user text.
 */
export async function generateAuthenticMemorialPdf(
  memorialData: any,
  filename?: string
): Promise<boolean> {
  try {
    const rawName = memorialData?.name || 'Loved One';
    const cleanName = rawName.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Loved_One';
    const pdfFilename = filename || `In_Memory_Of_${cleanName}_Print_Ready.pdf`;

    // Find theme background image
    let themeImageUrl = memorialData?.themeImage;
    if (!themeImageUrl && memorialData?.themeId) {
      const tmpl = TEMPLATES.find(t => t.id === memorialData.themeId);
      if (tmpl) themeImageUrl = tmpl.image;
    }
    if (!themeImageUrl) {
      themeImageUrl = TEMPLATES[0]?.image || "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop";
    }

    const portraitUrl = memorialData?.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop";

    // 1. Convert to Safe Data URLs (eliminates canvas taint errors)
    const [themeDataUrl, portraitDataUrl] = await Promise.all([
      toSafeDataUrl(themeImageUrl),
      toSafeDataUrl(portraitUrl)
    ]);

    const [themeImg, portraitImg] = await Promise.all([
      themeDataUrl ? loadImageFromDataUrl(themeDataUrl) : null,
      portraitDataUrl ? loadImageFromDataUrl(portraitDataUrl) : null
    ]);

    const isLandscape = memorialData?.format?.includes('Thank You') || memorialData?.format?.includes('Inside');

    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const canvasWidth = 1200;
    const canvasHeight = 1800;

    // --- PAGE 1: FRONT SIDE / COVER ---
    const canvas1 = document.createElement('canvas');
    canvas1.width = canvasWidth;
    canvas1.height = canvasHeight;
    const ctx1 = canvas1.getContext('2d');

    if (ctx1) {
      // 1. Background Fill
      ctx1.fillStyle = '#faf8f5';
      ctx1.fillRect(0, 0, canvasWidth, canvasHeight);

      // 2. Theme Background Image
      if (themeImg) {
        ctx1.save();
        ctx1.globalAlpha = 0.32;
        ctx1.drawImage(themeImg, 0, 0, canvasWidth, canvasHeight);
        ctx1.restore();
      }

      // 3. Gold Decorative Border
      ctx1.strokeStyle = '#967440';
      ctx1.lineWidth = 4;
      ctx1.strokeRect(50, 50, canvasWidth - 100, canvasHeight - 100);

      ctx1.strokeStyle = '#d4af37';
      ctx1.lineWidth = 2;
      ctx1.strokeRect(65, 65, canvasWidth - 130, canvasHeight - 130);

      // 4. Header: "Forever in Our Hearts" / Tagline
      ctx1.textAlign = 'center';
      ctx1.fillStyle = '#967440';
      ctx1.font = 'italic 46px "Times New Roman", Georgia, serif';
      ctx1.fillText(memorialData?.tagline || 'Forever in Our Hearts', canvasWidth / 2, 220);

      // 5. Framed Portrait Photo
      const photoBoxWidth = 520;
      const photoBoxHeight = 640;
      const photoX = (canvasWidth - photoBoxWidth) / 2;
      const photoY = 290;

      // Photo Frame Shadow & Border
      ctx1.fillStyle = '#f4ece4';
      ctx1.fillRect(photoX, photoY, photoBoxWidth, photoBoxHeight);
      ctx1.strokeStyle = '#967440';
      ctx1.lineWidth = 6;
      ctx1.strokeRect(photoX, photoY, photoBoxWidth, photoBoxHeight);

      if (portraitImg) {
        ctx1.save();
        ctx1.beginPath();
        ctx1.rect(photoX + 8, photoY + 8, photoBoxWidth - 16, photoBoxHeight - 16);
        ctx1.clip();
        ctx1.drawImage(portraitImg, photoX + 8, photoY + 8, photoBoxWidth - 16, photoBoxHeight - 16);
        ctx1.restore();
      }

      // 6. Name
      ctx1.fillStyle = '#2c1810';
      ctx1.font = 'bold 74px "Times New Roman", Georgia, serif';
      ctx1.fillText(rawName.toUpperCase(), canvasWidth / 2, 1070);

      // 7. Gold Accent Divider Line
      ctx1.beginPath();
      ctx1.moveTo(canvasWidth / 2 - 120, 1120);
      ctx1.lineTo(canvasWidth / 2 + 120, 1120);
      ctx1.strokeStyle = '#967440';
      ctx1.lineWidth = 3;
      ctx1.stroke();

      // 8. Dates
      const dob = memorialData?.dob || 'April 15, 1948';
      const dod = memorialData?.dod || 'May 3, 2026';
      ctx1.fillStyle = '#7a5c43';
      ctx1.font = 'italic 42px "Times New Roman", Georgia, serif';
      ctx1.fillText(`${dob}  –  ${dod}`, canvasWidth / 2, 1200);

      // 9. Service / Location detail
      if (memorialData?.serviceLocation || memorialData?.serviceDate) {
        ctx1.fillStyle = '#5c4033';
        ctx1.font = '32px sans-serif';
        const serviceText = [memorialData?.serviceDate, memorialData?.serviceLocation].filter(Boolean).join(' • ');
        ctx1.fillText(serviceText, canvasWidth / 2, 1300);
      }

      // 10. Footer brand watermark
      ctx1.fillStyle = '#b0a090';
      ctx1.font = '22px sans-serif';
      ctx1.fillText('Archival Print Asset • FuneralFolio Collection', canvasWidth / 2, canvasHeight - 90);

      // Add Page 1 to PDF
      const img1Data = canvas1.toDataURL('image/jpeg', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio1 = Math.min((pdfWidth - 20) / (canvasWidth / 3.78), (pdfHeight - 20) / (canvasHeight / 3.78));
      const printW1 = (canvasWidth / 3.78) * ratio1;
      const printH1 = (canvasHeight / 3.78) * ratio1;
      const marginX1 = (pdfWidth - printW1) / 2;
      const marginY1 = (pdfHeight - printH1) / 2;

      pdf.addImage(img1Data, 'JPEG', marginX1, marginY1, printW1, printH1);
    }

    // --- PAGE 2: BACK SIDE (Prayer / Hymn / Tribute) ---
    const canvas2 = document.createElement('canvas');
    canvas2.width = canvasWidth;
    canvas2.height = canvasHeight;
    const ctx2 = canvas2.getContext('2d');

    if (ctx2) {
      // 1. Background Fill
      ctx2.fillStyle = '#faf8f5';
      ctx2.fillRect(0, 0, canvasWidth, canvasHeight);

      // 2. Theme Background
      if (themeImg) {
        ctx2.save();
        ctx2.globalAlpha = 0.25;
        ctx2.drawImage(themeImg, 0, 0, canvasWidth, canvasHeight);
        ctx2.restore();
      }

      // 3. Dual Gold Border
      ctx2.strokeStyle = '#967440';
      ctx2.lineWidth = 4;
      ctx2.strokeRect(50, 50, canvasWidth - 100, canvasHeight - 100);

      ctx2.strokeStyle = '#d4af37';
      ctx2.lineWidth = 2;
      ctx2.strokeRect(65, 65, canvasWidth - 130, canvasHeight - 130);

      // 4. Prayer / Tribute Title
      const prayerTitle = memorialData?.prayerTitle || 'The 23rd Psalm';
      ctx2.textAlign = 'center';
      ctx2.fillStyle = '#5c4033';
      ctx2.font = 'bold 56px "Times New Roman", Georgia, serif';
      ctx2.fillText(prayerTitle, canvasWidth / 2, 280);

      // 5. Divider
      ctx2.beginPath();
      ctx2.moveTo(canvasWidth / 2 - 100, 320);
      ctx2.lineTo(canvasWidth / 2 + 100, 320);
      ctx2.strokeStyle = '#967440';
      ctx2.lineWidth = 3;
      ctx2.stroke();

      // 6. Prayer / Poem Text
      const prayerText = memorialData?.prayerText || memorialData?.poem || memorialData?.obituaryText ||
        "The Lord is my shepherd; I shall not want.\nHe maketh me to lie down in green pastures:\nhe leadeth me beside the still waters.\nHe restoreth my soul:\nhe leadeth me in the paths of righteousness\nfor his name's sake.\nYea, though I walk through the valley\nof the shadow of death,\nI will fear no evil: for thou art with me;\nthy rod and thy staff they comfort me.\nSurely goodness and mercy shall follow me\nall the days of my life:\nand I will dwell in the house of the Lord for ever.";

      ctx2.fillStyle = '#3d2b20';
      ctx2.font = 'italic 36px "Times New Roman", Georgia, serif';
      
      const lines = prayerText.split('\n');
      let startY = 440;
      const lineHeight = 54;

      for (const line of lines) {
        if (startY > canvasHeight - 200) break;
        ctx2.fillText(line.trim(), canvasWidth / 2, startY);
        startY += lineHeight;
      }

      // Add Page 2 to PDF
      pdf.addPage();
      const img2Data = canvas2.toDataURL('image/jpeg', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio2 = Math.min((pdfWidth - 20) / (canvasWidth / 3.78), (pdfHeight - 20) / (canvasHeight / 3.78));
      const printW2 = (canvasWidth / 3.78) * ratio2;
      const printH2 = (canvasHeight / 3.78) * ratio2;
      const marginX2 = (pdfWidth - printW2) / 2;
      const marginY2 = (pdfHeight - printH2) / 2;

      pdf.addImage(img2Data, 'JPEG', marginX2, marginY2, printW2, printH2);
    }

    // Save with explicit .pdf extension
    savePdfDocument(pdf, pdfFilename);
    return true;
  } catch (error) {
    console.error('Authentic PDF export error:', error);
    return false;
  }
}

/**
 * Downloads the card/poster front design directly as a high-res PNG image.
 */
export async function generateAuthenticMemorialImages(
  memorialData: any
): Promise<boolean> {
  try {
    const rawName = memorialData?.name || 'Loved One';
    const cleanName = rawName.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Loved_One';

    let themeImageUrl = memorialData?.themeImage;
    if (!themeImageUrl && memorialData?.themeId) {
      const tmpl = TEMPLATES.find(t => t.id === memorialData.themeId);
      if (tmpl) themeImageUrl = tmpl.image;
    }
    if (!themeImageUrl) {
      themeImageUrl = TEMPLATES[0]?.image || "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop";
    }

    const portraitUrl = memorialData?.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop";

    const [themeDataUrl, portraitDataUrl] = await Promise.all([
      toSafeDataUrl(themeImageUrl),
      toSafeDataUrl(portraitUrl)
    ]);

    const [themeImg, portraitImg] = await Promise.all([
      themeDataUrl ? loadImageFromDataUrl(themeDataUrl) : null,
      portraitDataUrl ? loadImageFromDataUrl(portraitDataUrl) : null
    ]);

    const canvasWidth = 1200;
    const canvasHeight = 1800;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (themeImg) {
        ctx.save();
        ctx.globalAlpha = 0.32;
        ctx.drawImage(themeImg, 0, 0, canvasWidth, canvasHeight);
        ctx.restore();
      }

      ctx.strokeStyle = '#967440';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, canvasWidth - 100, canvasHeight - 100);

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.strokeRect(65, 65, canvasWidth - 130, canvasHeight - 130);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#967440';
      ctx.font = 'italic 46px "Times New Roman", Georgia, serif';
      ctx.fillText(memorialData?.tagline || 'Forever in Our Hearts', canvasWidth / 2, 220);

      const photoBoxWidth = 520;
      const photoBoxHeight = 640;
      const photoX = (canvasWidth - photoBoxWidth) / 2;
      const photoY = 290;

      ctx.fillStyle = '#f4ece4';
      ctx.fillRect(photoX, photoY, photoBoxWidth, photoBoxHeight);
      ctx.strokeStyle = '#967440';
      ctx.lineWidth = 6;
      ctx.strokeRect(photoX, photoY, photoBoxWidth, photoBoxHeight);

      if (portraitImg) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX + 8, photoY + 8, photoBoxWidth - 16, photoBoxHeight - 16);
        ctx.clip();
        ctx.drawImage(portraitImg, photoX + 8, photoY + 8, photoBoxWidth - 16, photoBoxHeight - 16);
        ctx.restore();
      }

      ctx.fillStyle = '#2c1810';
      ctx.font = 'bold 74px "Times New Roman", Georgia, serif';
      ctx.fillText(rawName.toUpperCase(), canvasWidth / 2, 1070);

      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2 - 120, 1120);
      ctx.lineTo(canvasWidth / 2 + 120, 1120);
      ctx.strokeStyle = '#967440';
      ctx.lineWidth = 3;
      ctx.stroke();

      const dob = memorialData?.dob || 'April 15, 1948';
      const dod = memorialData?.dod || 'May 3, 2026';
      ctx.fillStyle = '#7a5c43';
      ctx.font = 'italic 42px "Times New Roman", Georgia, serif';
      ctx.fillText(`${dob}  –  ${dod}`, canvasWidth / 2, 1200);

      const pngData = canvas.toDataURL('image/png');
      downloadDataUrl(pngData, `In_Memory_Of_${cleanName}_Print.png`);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Image export error:', err);
    return false;
  }
}
