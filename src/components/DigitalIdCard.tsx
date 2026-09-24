import React, { useRef, useState } from 'react';
import { MemberProfile } from '../types';
import { Download, Printer, ShieldCheck, Loader2, Eye, RotateCw, LayoutGrid } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  profile: MemberProfile;
}

export function formatDateDDMMYYYY(rawDate?: string): string {
  if (!rawDate) return '';
  const dateOnly = rawDate.split('T')[0];
  const parts = dateOnly.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    return `${day}/${month}/${year}`;
  }
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return rawDate;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export const DigitalIdCard: React.FC<Props> = ({ profile }) => {
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState<'BOTH' | 'FRONT' | 'BACK'>('BOTH');

  const issueDateStr = formatDateDDMMYYYY(profile.approvalDate || profile.submittedAt) || '18/09/2026';

  const websiteUrl = 'https://national-youth-program-sindh.vercel.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(websiteUrl)}`;

  // Helper function to safely convert external image URLs to base64 Data URLs to avoid canvas tainting
  const getBase64ImageFromUrl = async (url: string): Promise<string> => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;

    try {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch {
      // Fall back to Image canvas technique
    }

    return new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width || 300;
          canvas.height = img.naturalHeight || img.height || 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            resolve(dataUrl);
            return;
          }
        } catch {
          // Canvas tainted fallback
        }
        resolve(url);
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  };

  // Capture element to canvas reliably by cloning offscreen and resolving images
  const captureCard = async (element: HTMLElement | null): Promise<HTMLCanvasElement | null> => {
    if (!element) return null;

    const clone = element.cloneNode(true) as HTMLElement;
    clone.classList.remove('hidden');
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = '420px';
    clone.style.height = 'auto';
    clone.style.minHeight = '510px';
    clone.style.zIndex = '-9999';
    clone.style.opacity = '1';
    clone.style.visibility = 'visible';
    clone.style.transform = 'none';

    document.body.appendChild(clone);

    try {
      const images = Array.from(clone.querySelectorAll('img'));
      await Promise.all(
        images.map(async (img) => {
          const originalSrc = img.getAttribute('src') || img.src;
          if (originalSrc && !originalSrc.startsWith('data:')) {
            const absoluteUrl = new URL(originalSrc, window.location.origin).href;
            const base64 = await getBase64ImageFromUrl(absoluteUrl);
            if (base64) {
              img.src = base64;
            }
          }
        })
      );

      if (document.fonts) {
        await document.fonts.ready;
      }
      await new Promise((r) => setTimeout(r, 120));

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff'
      });

      return canvas;
    } catch (err) {
      console.error('Error capturing card canvas:', err);
      return null;
    } finally {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    }
  };

  // PDF Export for Both Sides Always
  const handleDownloadPDF = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const frontCanvas = await captureCard(frontCardRef.current);
      const backCanvas = await captureCard(backCardRef.current);

      if (!frontCanvas && !backCanvas) {
        throw new Error('Card elements unavailable');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const cardWidth = 86; // 86mm width per card on A4

      // Draw Top Header Banner
      pdf.setFillColor(15, 23, 42); // #0f172a slate-900
      pdf.rect(0, 0, pageWidth, 18, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NATIONAL YOUTH PARLIAMENT SINDH', pageWidth / 2, 8, { align: 'center' });
      pdf.setFontSize(7.5);
      pdf.setTextColor(251, 191, 36); // #fbbf24 amber-400
      pdf.text('OFFICIAL MEMBERSHIP IDENTIFICATION CARD', pageWidth / 2, 13, { align: 'center' });

      const yPosition = 28;
      let maxCardHeight = 108;

      if (frontCanvas) {
        const frontHeight = (cardWidth * frontCanvas.height) / frontCanvas.width;
        maxCardHeight = Math.max(maxCardHeight, frontHeight);
        const frontImgData = frontCanvas.toDataURL('image/png', 1.0);
        const frontX = 14;
        pdf.addImage(frontImgData, 'PNG', frontX, yPosition, cardWidth, frontHeight, undefined, 'FAST');
        
        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FRONT SIDE', frontX + (cardWidth / 2), yPosition + frontHeight + 5, { align: 'center' });
      }

      if (backCanvas) {
        const backHeight = (cardWidth * backCanvas.height) / backCanvas.width;
        maxCardHeight = Math.max(maxCardHeight, backHeight);
        const backImgData = backCanvas.toDataURL('image/png', 1.0);
        const backX = 110;
        pdf.addImage(backImgData, 'PNG', backX, yPosition, cardWidth, backHeight, undefined, 'FAST');
        
        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.setFont('helvetica', 'bold');
        pdf.text('BACK SIDE', backX + (cardWidth / 2), yPosition + backHeight + 5, { align: 'center' });
      }

      // Footer divider line and member details
      const footerY = yPosition + maxCardHeight + 14;
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(14, footerY, pageWidth - 14, footerY);

      pdf.setFontSize(8.5);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Member Name: ${profile.fullName || 'N/A'}`, 14, footerY + 7);
      pdf.text(`Membership ID: ${profile.membershipIdNumber || profile.cnicNumber || 'N/A'}`, 14, footerY + 13);
      pdf.text(`CNIC Number: ${profile.cnicNumber || 'N/A'}`, 14, footerY + 19);

      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Official Verified Digital Certificate & Membership ID Pass — NYP Sindh`, 14, footerY + 26);
      pdf.text(`Generated: ${formatDateDDMMYYYY(new Date().toISOString())}`, pageWidth - 14, footerY + 26, { align: 'right' });

      const safeId = (profile.membershipIdNumber || profile.cnicNumber || 'card').replace(/[^a-zA-Z0-9-]/g, '_');
      pdf.save(`NYP_Sindh_Membership_Card_${safeId}.pdf`);
    } catch (e) {
      console.error('PDF generation error:', e);
      alert('Generating PDF encountered an issue. Opening print dialog to Save as PDF...');
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    if (!containerRef.current) {
      window.print();
      return;
    }

    try {
      const printWindow = window.open('', '_blank', 'width=950,height=1000');
      if (!printWindow) {
        window.print();
        return;
      }

      const frontHtml = frontCardRef.current ? frontCardRef.current.outerHTML : '';
      const backHtml = backCardRef.current ? backCardRef.current.outerHTML : '';
      const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((el) => el.outerHTML)
        .join('\n');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>NYP Sindh Membership Card - ${profile.fullName}</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            ${styleTags}
            <style>
              body {
                background: #ffffff !important;
                color: #0f172a !important;
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
                display: flex !important;
                justify-content: center !important;
                align-items: flex-start !important;
                padding: 20px !important;
                margin: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .print-container {
                display: flex !important;
                flex-direction: row !important;
                gap: 20px !important;
                justify-content: center !important;
                align-items: center !important;
                flex-wrap: wrap !important;
              }
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${frontHtml}
              ${backHtml}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.focus();
                  window.print();
                  window.close();
                }, 400);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('Print window error:', err);
      window.print();
    }
  };

  // Reusable Official President Circular Blue Stamp SVG
  const PresidentStampSvg = () => {
    const topText = "ABDUL REHMAN HALEPOTO";
    const bottomText = "★ NYP SINDH ★";
    const rTop = 53;
    const rBottom = 54;

    const topChars = topText.split('').map((char, i) => {
      const angle = -68 + (i * (136 / (topText.length - 1)));
      return { char, angle };
    });

    const bottomChars = bottomText.split('').map((char, i) => {
      const angle = 138 + (i * (84 / (bottomText.length - 1)));
      return { char, angle };
    });

    return (
      <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Outer Circular Rings */}
        <circle cx="80" cy="80" r="74" fill="#ffffff" fillOpacity="0.9" stroke="#1d4ed8" strokeWidth="2.8" />
        <circle cx="80" cy="80" r="69" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 2" />
        
        {/* Center Inner Circle */}
        <circle cx="80" cy="80" r="41" fill="#f8fafc" stroke="#1d4ed8" strokeWidth="1.8" />
        <circle cx="80" cy="80" r="38" fill="none" stroke="#3b82f6" strokeWidth="0.8" />

        {/* Center Badge Text: PRESIDENT */}
        <text
          x="80"
          y="84.5"
          textAnchor="middle"
          fill="#1e40af"
          fontSize="11.5"
          fontWeight="900"
          fontFamily="'Arial Black', 'Outfit', sans-serif"
          letterSpacing="0.8"
        >
          PRESIDENT
        </text>

        {/* Top Arc Characters: ABDUL REHMAN HALEPOTO */}
        {topChars.map((item, idx) => (
          <text
            key={`top-${idx}`}
            x="80"
            y={80 - rTop}
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="9"
            fontWeight="900"
            fontFamily="'Arial Black', 'Outfit', sans-serif"
            transform={`rotate(${item.angle}, 80, 80)`}
          >
            {item.char}
          </text>
        ))}

        {/* Bottom Arc Characters: ★ NYP SINDH ★ */}
        {bottomChars.map((item, idx) => (
          <text
            key={`bottom-${idx}`}
            x="80"
            y={80 + rBottom}
            textAnchor="middle"
            fill="#1d4ed8"
            fontSize="9.5"
            fontWeight="900"
            fontFamily="'Arial Black', 'Outfit', sans-serif"
            transform={`rotate(${item.angle - 180}, 80, 80)`}
          >
            {item.char}
          </text>
        ))}
      </svg>
    );
  };

  // Reusable General Secretary Signature SVG
  const GeneralSecretarySignatureSvg = () => (
    <svg viewBox="0 0 200 65" style={{ width: '100%', height: '100%' }} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Expressive fluid blue signature of Humayun */}
      <path
        d="M 28,48 C 24,32 30,12 42,10 C 50,8 48,26 44,44 C 42,50 40,56 38,60 C 36,62 40,61 44,55 C 50,46 54,30 60,18 C 64,10 70,8 72,14 C 74,20 72,34 70,44"
        stroke="#1d4ed8"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 24,28 C 38,27 54,23 74,20"
        stroke="#1d4ed8"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M 70,44 C 73,36 78,28 82,27 C 86,25 89,32 87,38 C 89,32 94,27 98,26 C 103,24 105,30 104,36 C 107,30 112,25 117,25 C 122,24 124,30 123,36 C 125,30 130,26 135,26 C 140,25 142,30 140,38 C 143,30 148,25 153,25 C 158,25 160,32 159,38 C 158,45 154,54 148,58 C 144,60 142,58 144,52 C 148,40 156,28 165,24 C 172,20 178,25 174,32 C 172,36 166,40 160,40 C 168,39 178,34 186,28"
        stroke="#1d4ed8"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="190" cy="20" r="2.5" fill="#1d4ed8" />
    </svg>
  );

  // Reusable Sindh Map Silhouette SVG
  const SindhMapSvg = () => (
    <svg viewBox="0 0 100 120" style={{ width: '100%', height: '100%', fill: '#cfc6bb' }}>
      <path d="M45,5 C55,8 65,15 70,25 C75,35 85,45 88,60 C90,75 80,88 72,100 C65,110 50,115 35,110 C25,105 18,92 15,80 C12,65 18,50 25,35 C30,22 38,10 45,5 Z" />
    </svg>
  );

  // Reusable Background Architectural Monument Watermark SVG
  const MonumentWatermarkSvg = () => (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', opacity: 0.07, fill: '#b45309' }}>
      <path d="M20,200 L20,140 L35,140 L35,110 L45,110 L45,80 L55,70 L65,80 L65,110 L75,110 L75,140 L90,140 L90,200 Z" />
      <path d="M120,200 L120,120 L135,120 L135,90 L160,60 L185,90 L185,120 L200,120 L200,200 Z" />
      <path d="M230,200 L230,130 L245,130 L245,95 L260,75 L275,95 L275,130 L290,130 L290,200 Z" />
      <path d="M310,200 L310,140 L325,140 L325,110 L335,110 L335,80 L345,70 L355,80 L355,110 L365,110 L365,140 L380,140 L380,200 Z" />
      {/* Dome Arches */}
      <circle cx="160" cy="65" r="18" />
      <circle cx="260" cy="80" r="14" />
    </svg>
  );

  return (
    <div className="w-full space-y-6">
      
      {/* Top Action & View Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl no-print shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs sm:text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Official Membership ID Card (Exact Vendor Design Match)</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Both Sides</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-lg transition-transform hover:scale-105 cursor-pointer uppercase tracking-wider"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Card PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="flex items-center justify-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-fit mx-auto">
          <button
            onClick={() => setActiveTab('BOTH')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'BOTH'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Both Sides</span>
          </button>

          <button
            onClick={() => setActiveTab('FRONT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'FRONT'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Front Side Only</span>
          </button>

          <button
            onClick={() => setActiveTab('BACK')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'BACK'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Back Side Only</span>
          </button>
        </div>

      </div>

      {/* Fully Responsive Unclipped Card Container */}
      <div 
        ref={containerRef} 
        className="w-full py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 min-h-[580px] max-w-full overflow-visible px-1"
      >
        
        {/* ======================================================== */}
        {/* FRONT SIDE OF ID CARD (EXACT MATCH TO REFERENCE IMAGE)    */}
        {/* ======================================================== */}
        <div
          ref={frontCardRef}
          className={`print-card-front transition-all duration-300 shrink-0 ${activeTab === 'BACK' ? 'hidden' : 'block'}`}
          style={{
            width: '420px',
            maxWidth: '100%',
            minHeight: '510px',
            background: '#ffffff',
            color: '#0f172a',
            border: '2px solid #cbd5e1',
            borderRadius: '24px',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 35px -5px rgba(0, 0, 0, 0.2), 0 10px 15px -5px rgba(0, 0, 0, 0.1)',
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          }}
        >
          {/* Background Watermark Architecture Layer */}
          <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, height: '160px', pointerEvents: 'none', zIndex: 1 }}>
            <MonumentWatermarkSvg />
          </div>

          {/* TOP SECTION: WHITE HEADER WITH EMBLEM, TITLE & SINDH MAP */}
          <div style={{ position: 'relative', zIndex: 10, padding: '14px 16px 4px 16px', background: '#ffffff' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              
              {/* NYP Emblem Logo Left */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '64px', flexShrink: 0 }}>
                <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                  <img src="/nyp-logo.png" alt="NYP Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Center Title & S I N D H */}
              <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                <h1 style={{ color: '#0f172a', fontSize: '13.2px', fontWeight: 900, letterSpacing: '-0.1px', margin: 0, padding: 0, textTransform: 'uppercase', lineHeight: 1.15, whiteSpace: 'nowrap', fontFamily: "'Outfit', sans-serif" }}>
                  NATIONAL YOUTH PARLIAMENT
                </h1>
                
                {/* Gold Lines with S I N D H */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '3px 0' }}>
                  <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
                  <span style={{ color: '#d97706', fontSize: '12px', fontWeight: 900, letterSpacing: '3px', whiteSpace: 'nowrap' }}>
                    S I N D H
                  </span>
                  <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
                </div>

                <div style={{ color: '#334155', fontSize: '6.5px', fontWeight: 800, letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  YOUTH TODAY &nbsp;|&nbsp; A STRONGER PAKISTAN TOMORROW
                </div>
              </div>

              {/* Sindh Identity Map Logo & Slogan Badge Right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0, paddingTop: '2px' }}>
                <div style={{ width: '36px', height: '48px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img 
                    src="/sindh-identity-logo.png" 
                    alt="Sindh Map" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
                <div style={{ width: '2.5px', height: '36px', background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', borderRadius: '1.5px', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px', fontFamily: "'Outfit', sans-serif" }}>
                    SINDH
                  </span>
                  <span style={{ fontSize: '6px', fontWeight: 800, color: '#1e293b', letterSpacing: '0.3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    OUR IDENTITY
                  </span>
                  <span style={{ fontSize: '6px', fontWeight: 800, color: '#1e293b', letterSpacing: '0.3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    OUR PRIDE
                  </span>
                </div>
              </div>

            </div>

            {/* MEMBERSHIP CARD Gold Flanked Banner Divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', marginBottom: '8px' }}>
              <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
              <span style={{ color: '#0f172a', fontSize: '11px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                MEMBERSHIP CARD
              </span>
              <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
            </div>

          </div>

          {/* MAIN BODY: PHOTO LEFT, MEMBER DETAILS RIGHT */}
          <div style={{ padding: '0 18px', display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
            
            {/* Member Photo Frame (Gold Double Border) */}
            <div style={{ width: '130px', flexShrink: 0 }}>
              <div 
                style={{
                  width: '126px',
                  height: '162px',
                  borderRadius: '16px',
                  border: '3.5px solid #d97706',
                  padding: '2px',
                  background: '#ffffff',
                  boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.12)',
                  boxSizing: 'border-box'
                }}
              >
                {profile.passportPhotoUrl ? (
                  <img
                    src={profile.passportPhotoUrl}
                    alt={profile.fullName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '11px'
                    }}
                  />
                ) : (
                  /* Clean Male Suit Silhouette fallback matching reference graphic */
                  <div style={{ width: '100%', height: '100%', background: '#e2e8f0', borderRadius: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}>
                    <svg viewBox="0 0 100 120" style={{ width: '85%', height: '85%', fill: '#1e293b' }}>
                      {/* Head */}
                      <circle cx="50" cy="38" r="22" />
                      {/* Suit Shoulders */}
                      <path d="M10,120 C10,80 30,70 50,70 C70,70 90,80 90,120 Z" />
                      {/* White Shirt Collar & Tie */}
                      <polygon points="50,70 42,90 58,90" fill="#ffffff" />
                      <polygon points="50,75 46,120 54,120" fill="#0f172a" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Member Information Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '2px', overflow: 'hidden' }}>
              
              <h2 style={{ color: '#0f172a', fontSize: '18.5px', fontWeight: 900, margin: 0, padding: 0, textTransform: 'uppercase', lineHeight: 1.15, letterSpacing: '-0.2px', wordBreak: 'break-word', fontFamily: "'Outfit', sans-serif" }}>
                {profile.fullName || 'YOUR NAME'}
              </h2>
              
              {/* Official Role / Designation directly under Name (e.g. YOUTH MPA, PRESIDENT KARACHI DIVISION, etc.) */}
              <div style={{ color: '#022c1e', fontSize: '12.5px', fontWeight: 900, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.2, fontFamily: "'Outfit', sans-serif" }}>
                {(profile.assignedDesignation || 'GENERAL MEMBER').toUpperCase()}
              </div>
              
              <div style={{ color: '#334155', fontSize: '10.5px', fontWeight: 700, lineHeight: 1.25, marginTop: '1px' }}>
                National Youth Parliament Sindh
              </div>

              {/* Gold Horizontal Accent Line */}
              <div style={{ width: '42px', height: '2px', background: '#d97706', margin: '6px 0 7px 0' }}></div>

              {/* Aligned Field Table with Colons (Department removed as requested) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5px', fontSize: '9.5px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#475569', fontWeight: 800, width: '78px', flexShrink: 0 }}>Member ID</span>
                  <span style={{ color: '#0f172a', fontWeight: 900, fontFamily: 'monospace', fontSize: '10px', whiteSpace: 'nowrap' }}>: &nbsp;{profile.membershipIdNumber || 'NYPS-2026-0001'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#475569', fontWeight: 800, width: '78px', flexShrink: 0 }}>CNIC</span>
                  <span style={{ color: '#0f172a', fontWeight: 800, fontFamily: 'monospace', fontSize: '9.5px', whiteSpace: 'nowrap' }}>: &nbsp;{profile.cnicNumber || 'N/A'}</span>
                </div>

                {profile.dob && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontWeight: 800, width: '78px', flexShrink: 0 }}>Date of Birth</span>
                    <span style={{ color: '#0f172a', fontWeight: 800, whiteSpace: 'nowrap' }}>: &nbsp;{formatDateDDMMYYYY(profile.dob)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#475569', fontWeight: 800, width: '78px', flexShrink: 0 }}>Date of Issue</span>
                  <span style={{ color: '#0f172a', fontWeight: 800, whiteSpace: 'nowrap' }}>: &nbsp;{issueDateStr}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#475569', fontWeight: 800, width: '78px', flexShrink: 0 }}>Valid Till</span>
                  <span style={{ color: '#0f172a', fontWeight: 800, whiteSpace: 'nowrap' }}>: &nbsp;31/12/2026</span>
                </div>

              </div>

            </div>

          </div>

          {/* LOWER BODY: QR CODE LEFT, PRESIDENT SIGNATURE RIGHT */}
          <div style={{ padding: '0 18px 10px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 10 }}>
            
            {/* QR Code Left */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ padding: '3px', background: '#ffffff', borderRadius: '8px', border: '1.5px solid #0f172a', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                <img src={qrCodeUrl} alt="Verification QR" style={{ width: '66px', height: '66px', display: 'block', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#1e293b', display: 'block', marginTop: '3px', whiteSpace: 'nowrap' }}>
                Scan for Verification
              </span>
            </div>

            {/* President Signature Right */}
            <div style={{ textAlign: 'center', flex: 1, paddingLeft: '20px' }}>
              <div style={{ fontFamily: "'Brush Script MT', 'Great Vibes', Georgia, serif", fontStyle: 'italic', color: '#032e1e', fontWeight: 900, fontSize: '24px', height: '28px', lineHeight: 1.1 }}>
                Halepoto
              </div>
              <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '3px', fontSize: '8.5px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                ABDUL REHMAN HALEPOTO
              </div>
              <div style={{ fontSize: '7.5px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginTop: '1px', whiteSpace: 'nowrap' }}>
                PRESIDENT, NYP SINDH
              </div>
            </div>

          </div>

          {/* CURVED WAVE DARK GREEN FOOTER BANNER WITH GOLD BORDER */}
          <div style={{ position: 'relative', width: '100%', marginTop: 'auto', zIndex: 10 }}>
            {/* Curved SVG Wave Top with Gold Border Stroke */}
            <svg viewBox="0 0 420 28" style={{ display: 'block', width: '100%', height: '22px' }}>
              <path d="M 0,28 Q 210,-10 420,28 Z" fill="#032e1e" />
              <path d="M 0,28 Q 210,-10 420,28" fill="none" stroke="#d97706" strokeWidth="3" />
            </svg>

            {/* Dark Green Banner Body */}
            <div style={{ background: 'linear-gradient(135deg, #022c1e 0%, #064e3b 100%)', color: '#ffffff', padding: '6px 14px 10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '2.5px', color: '#fbbf24', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                — Y O U T H &nbsp; L E A D I N G &nbsp; F U T U R E —
              </div>
              <div style={{ fontSize: '6.8px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.5px', marginTop: '3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                EMPOWERING YOUTH &nbsp;|&nbsp; STRENGTHENING SINDH &nbsp;|&nbsp; BUILDING A BRIGHTER TOMORROW
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* BACK SIDE OF ID CARD (EXACT MATCH TO REFERENCE IMAGE)     */}
        {/* ======================================================== */}
        <div
          ref={backCardRef}
          className={`print-card-back transition-all duration-300 shrink-0 ${activeTab === 'FRONT' ? 'hidden' : 'block'}`}
          style={{
            width: '420px',
            maxWidth: '100%',
            minHeight: '510px',
            background: '#ffffff',
            color: '#0f172a',
            border: '2px solid #cbd5e1',
            borderRadius: '24px',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 35px -5px rgba(0, 0, 0, 0.2), 0 10px 15px -5px rgba(0, 0, 0, 0.1)',
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          }}
        >
          {/* Background Watermark Architecture Layer */}
          <div style={{ position: 'absolute', top: '120px', left: 0, right: 0, height: '180px', pointerEvents: 'none', zIndex: 1 }}>
            <MonumentWatermarkSvg />
          </div>

          {/* TOP SECTION: DARK GREEN HEADER WITH DOWNWARD CURVED WAVE */}
          <div style={{ position: 'relative', zIndex: 10, background: 'linear-gradient(135deg, #022c1e 0%, #064e3b 100%)', color: '#ffffff', padding: '12px 16px 0 16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              
              {/* Emblem Logo Left */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '56px', flexShrink: 0 }}>
                <div style={{ width: '52px', height: '52px' }}>
                  <img src="/nyp-logo.png" alt="NYP Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Title Center */}
              <div style={{ flex: 1, textAlign: 'center', minWidth: 0, paddingRight: '12px' }}>
                <h2 style={{ color: '#ffffff', fontSize: '13.2px', fontWeight: 900, letterSpacing: '-0.1px', margin: 0, padding: 0, textTransform: 'uppercase', lineHeight: 1.15, whiteSpace: 'nowrap', fontFamily: "'Outfit', sans-serif" }}>
                  NATIONAL YOUTH PARLIAMENT
                </h2>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '2px 0' }}>
                  <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
                  <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 900, letterSpacing: '3px', whiteSpace: 'nowrap' }}>
                    S I N D H
                  </span>
                  <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
                </div>

                <div style={{ color: '#a7f3d0', fontSize: '6.5px', fontWeight: 800, letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  YOUTH TODAY &nbsp;|&nbsp; A STRONGER PAKISTAN TOMORROW
                </div>
              </div>

            </div>

            {/* Downward Curved Wave SVG at Header Bottom */}
            <svg viewBox="0 0 420 20" style={{ display: 'block', width: '100%', height: '16px', marginTop: '8px' }}>
              <path d="M 0,0 Q 210,25 420,0 L 420,0 L 0,0 Z" fill="#ffffff" />
              <path d="M 0,0 Q 210,25 420,0" fill="none" stroke="#d97706" strokeWidth="2.5" />
            </svg>

          </div>

          {/* BACK CARD MIDDLE CONTENT */}
          <div style={{ padding: '4px 20px 10px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px', textAlign: 'left', position: 'relative', zIndex: 10 }}>
            
            {/* OUR VISION */}
            <div style={{ textAlign: 'center', padding: '2px 0' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px', display: 'block' }}>
                O U R &nbsp; V I S I O N
              </span>
              <p style={{ fontSize: '11px', fontWeight: 800, color: '#1e293b', fontStyle: 'italic', margin: '4px 0 0 0', fontFamily: 'Georgia, serif', lineHeight: 1.35 }}>
                “A Progressive, Inclusive and Empowered Sindh Led by its Youth”
              </p>
            </div>

            {/* TERMS & CONDITIONS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
                <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#d97706', textTransform: 'uppercase', letterSpacing: '2px', whiteSpace: 'nowrap' }}>
                  TERMS &amp; CONDITIONS
                </span>
                <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
              </div>

              <ol style={{ fontSize: '9px', color: '#1e293b', fontWeight: 700, lineHeight: 1.45, margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <li>This card is non-transferable and remains the property of National Youth Parliament Sindh.</li>
                <li>The holder must abide by the constitution, policies and code of conduct of NYP.</li>
                <li>This card must be produced when required for official purposes.</li>
                <li>In case of loss, immediately inform the NYP Sindh Secretariat.</li>
              </ol>

              {/* Bottom Gold Line under Terms */}
              <div style={{ height: '1px', background: '#d97706', marginTop: '8px' }}></div>
            </div>

            {/* MOTTO BANNER */}
            <div style={{ textAlign: 'center', padding: '2px 0' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                D I S C U S S &nbsp;<span style={{ color: '#d97706' }}>|</span>&nbsp; D E B A T E &nbsp;<span style={{ color: '#d97706' }}>|</span>&nbsp; D E L I V E R
              </div>
              <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#b45309', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px', whiteSpace: 'nowrap' }}>
                F O R &nbsp; A &nbsp; B E T T E R &nbsp; S I N D H
              </div>
            </div>

            {/* CONTACT & SOCIAL MEDIA ROW WITH SINDH MAP BADGE */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '4px' }}>
              
              {/* Social Media Links Left */}
              <div style={{ fontSize: '8.5px', color: '#1e293b', fontWeight: 800, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                
                {/* Website */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '15px', height: '15px', borderRadius: '3px', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 900 }}>
                    🌐
                  </div>
                  <span>www.nypsindh.org.pk</span>
                </div>

                {/* Instagram */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '15px', height: '15px', borderRadius: '3px', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 900 }}>
                    📷
                  </div>
                  <span>@nypsindh</span>
                </div>

                {/* Facebook */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '15px', height: '15px', borderRadius: '3px', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 900 }}>
                    f
                  </div>
                  <span>National Youth Parliament Sindh</span>
                </div>

                {/* LinkedIn */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '15px', height: '15px', borderRadius: '3px', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 900 }}>
                    in
                  </div>
                  <span>NYPSindh</span>
                </div>

              </div>

              {/* Sindh Map Logo & Slogan Badge Right (In place of stamp) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, paddingRight: '4px' }}>
                <div style={{ width: '42px', height: '54px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img 
                    src="/sindh-identity-logo.png" 
                    alt="Sindh Map" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>

                <div style={{ width: '3px', height: '42px', background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', borderRadius: '1.5px', flexShrink: 0 }} />

                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px', fontFamily: "'Outfit', sans-serif" }}>
                    SINDH
                  </span>
                  <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#1e293b', letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    OUR IDENTITY
                  </span>
                  <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#1e293b', letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    OUR PRIDE
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* CURVED WAVE DARK GREEN FOOTER BANNER WITH GOLD BORDER */}
          <div style={{ position: 'relative', width: '100%', marginTop: 'auto', zIndex: 10 }}>
            {/* Curved SVG Wave Top with Gold Border Stroke */}
            <svg viewBox="0 0 420 28" style={{ display: 'block', width: '100%', height: '22px' }}>
              <path d="M 0,28 Q 210,-10 420,28 Z" fill="#032e1e" />
              <path d="M 0,28 Q 210,-10 420,28" fill="none" stroke="#d97706" strokeWidth="3" />
            </svg>

            {/* Dark Green Banner Body */}
            <div style={{ background: 'linear-gradient(135deg, #022c1e 0%, #064e3b 100%)', color: '#ffffff', padding: '6px 14px 10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '2.5px', color: '#fbbf24', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                — Y O U T H &nbsp; L E A D I N G &nbsp; F U T U R E —
              </div>
              <div style={{ fontSize: '6.8px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.5px', marginTop: '3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                EMPOWERING YOUTH &nbsp;|&nbsp; STRENGTHENING SINDH &nbsp;|&nbsp; BUILDING A BRIGHTER TOMORROW
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
