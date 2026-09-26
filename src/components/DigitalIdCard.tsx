import React, { useRef, useState, useEffect } from 'react';
import { MemberProfile } from '../types';
import { Download, Printer, ShieldCheck, Loader2, Eye, RotateCw, LayoutGrid } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { store } from '../services/store';
import { SINDH_DIVISIONS, SINDH_DISTRICTS, SINDH_TALUKAS } from '../data/sindhHierarchy';

interface Props {
  profile: MemberProfile;
}

function formatDateDDMMYYYY(rawDate?: string): string {
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
  const [cardScale, setCardScale] = useState<number>(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 16;
        if (containerWidth > 0 && containerWidth < 540) {
          setCardScale(containerWidth / 540);
        } else {
          setCardScale(1);
        }
      }
    };

    updateScale();

    window.addEventListener('resize', updateScale);
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(updateScale);
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      if (observer) observer.disconnect();
    };
  }, []);

  const issueDateStr = formatDateDDMMYYYY(profile.approvalDate || profile.submittedAt) || '18/09/2026';

  // Geographic Jurisdiction Resolvers
  const provinceName = profile.province || 'Sindh';

  const divisionName = (() => {
    if (!profile.divisionId) return 'Sindh';
    const found = SINDH_DIVISIONS.find(
      (d) => d.id === profile.divisionId || d.name.toLowerCase() === profile.divisionId.toLowerCase()
    );
    if (found) return found.name;
    const fromStore = store.getDivisionName(profile.divisionId);
    return fromStore || profile.divisionId;
  })();

  const districtName = (() => {
    if (!profile.districtId) return '';
    const found = SINDH_DISTRICTS.find(
      (d) => d.id === profile.districtId || d.name.toLowerCase() === profile.districtId.toLowerCase()
    );
    if (found) return found.name;
    const fromStore = store.getDistrictName(profile.districtId);
    return fromStore || profile.districtId;
  })();

  const talukaName = (() => {
    if (!profile.talukaId) return '';
    const found = SINDH_TALUKAS.find(
      (t) => t.id === profile.talukaId || t.name.toLowerCase() === profile.talukaId.toLowerCase()
    );
    if (found) return found.name;
    const fromStore = store.getTalukaName(profile.talukaId);
    return fromStore || profile.talukaId;
  })();

  const websiteUrl = 'https://nypsindh.org.pk/';
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
    clone.style.width = '540px';
    clone.style.height = 'auto';
    clone.style.minHeight = '340px';
    clone.style.zIndex = '-9999';
    clone.style.opacity = '1';
    clone.style.visibility = 'visible';
    // Adjust contact text offset only on the PDF capture clone for html2canvas baseline compensation
    const pdfContactSpans = clone.querySelectorAll('.pdf-contact-text');
    pdfContactSpans.forEach((span) => {
      const s = span as HTMLElement;
      s.style.position = 'relative';
      s.style.top = '-3.5px';
    });

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

  // PDF Export for Both Horizontal Sides
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
      const cardWidth = 148; // 148mm width for horizontal card on A4

      // Draw Top Header Banner
      pdf.setFillColor(15, 23, 42); // #0f172a slate-900
      pdf.rect(0, 0, pageWidth, 18, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NATIONAL YOUTH PARLIAMENT SINDH', pageWidth / 2, 8, { align: 'center' });
      pdf.setFontSize(7.5);
      pdf.setTextColor(251, 191, 36); // #fbbf24 amber-400
      pdf.text('OFFICIAL LANDSCAPE MEMBERSHIP IDENTIFICATION CARD', pageWidth / 2, 13, { align: 'center' });

      const cardX = (pageWidth - cardWidth) / 2; // 31mm centered
      let currentY = 25;

      if (frontCanvas) {
        const frontHeight = (cardWidth * frontCanvas.height) / frontCanvas.width;
        const frontImgData = frontCanvas.toDataURL('image/png', 1.0);
        pdf.addImage(frontImgData, 'PNG', cardX, currentY, cardWidth, frontHeight, undefined, 'FAST');

        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FRONT SIDE (LANDSCAPE)', pageWidth / 2, currentY + frontHeight + 4, { align: 'center' });
        currentY += frontHeight + 12;
      }

      if (backCanvas) {
        const backHeight = (cardWidth * backCanvas.height) / backCanvas.width;
        const backImgData = backCanvas.toDataURL('image/png', 1.0);
        pdf.addImage(backImgData, 'PNG', cardX, currentY, cardWidth, backHeight, undefined, 'FAST');

        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.setFont('helvetica', 'bold');
        pdf.text('BACK SIDE (LANDSCAPE)', pageWidth / 2, currentY + backHeight + 4, { align: 'center' });
        currentY += backHeight + 10;
      }

      // Footer divider line and member details
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(14, currentY, pageWidth - 14, currentY);

      pdf.setFontSize(8.5);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Member Name: ${profile.fullName || 'N/A'}`, 14, currentY + 6);
      pdf.text(`Membership ID: ${profile.membershipIdNumber || profile.cnicNumber || 'N/A'}`, 14, currentY + 12);
      pdf.text(`CNIC Number: ${profile.cnicNumber || 'N/A'}`, pageWidth / 2, currentY + 6);
      pdf.text(`Division: ${divisionName}`, pageWidth / 2, currentY + 12);

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Official Verified Digital Certificate & Membership ID Pass — NYP Sindh`, 14, currentY + 19);
      pdf.text(`Generated: ${formatDateDDMMYYYY(new Date().toISOString())}`, pageWidth - 14, currentY + 19, { align: 'right' });

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
                flex-direction: column !important;
                gap: 24px !important;
                justify-content: center !important;
                align-items: center !important;
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

  // Reusable Official Circular Red Security Stamp SVG with Logo in Center
  const OfficialRedStampSvg = () => {
    const topText = "OFFICIAL MEMBERSHIP PASS";
    const bottomText = "★ NYP SINDH VERIFIED ★";
    const rTop = 54;
    const rBottom = 54;

    const topChars = topText.split('').map((char, i) => {
      const angle = -72 + (i * (144 / (topText.length - 1)));
      const rad = (angle * Math.PI) / 180;
      const x = 80 + rTop * Math.sin(rad);
      const y = 80 - rTop * Math.cos(rad);
      return { char, x, y, angle };
    });

    const bottomChars = bottomText.split('').map((char, i) => {
      const angle = -62 + (i * (124 / (bottomText.length - 1)));
      const rad = (angle * Math.PI) / 180;
      const x = 80 + rBottom * Math.sin(rad);
      const y = 80 + rBottom * Math.cos(rad);
      return { char, x, y, angle: -angle };
    });

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', overflow: 'visible', opacity: 0.94 }}>
          {/* Outer Heavy Crimson Ring */}
          <circle cx="80" cy="80" r="75" fill="#dc2626" fillOpacity="0.06" stroke="#b91c1c" strokeWidth="3.5" />
          {/* Fine Inner Dashed Security Ring */}
          <circle cx="80" cy="80" r="70" fill="none" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="4 2" />
          {/* Micro Notched Dotted Security Ring */}
          <circle cx="80" cy="80" r="66" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="1.5 3" />

          {/* Center Inner Circle - Clean white fill with red & gold concentric rings */}
          <circle cx="80" cy="80" r="41" fill="#ffffff" fillOpacity="0.98" stroke="#b91c1c" strokeWidth="2.4" />
          <circle cx="80" cy="80" r="37.5" fill="none" stroke="#d97706" strokeWidth="1" />
          <circle cx="80" cy="80" r="35.5" fill="none" stroke="#ef4444" strokeWidth="0.8" />

          {/* Left Flanking Star */}
          <text x="13" y="83.5" textAnchor="middle" fill="#991b1b" fontSize="11" fontWeight="900">★</text>
          {/* Right Flanking Star */}
          <text x="147" y="83.5" textAnchor="middle" fill="#991b1b" fontSize="11" fontWeight="900">★</text>

          {/* Top Arc Characters: OFFICIAL MEMBERSHIP PASS */}
          {topChars.map((item, idx) => (
            <text
              key={`top-${idx}`}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#991b1b"
              fontSize="11.5"
              fontWeight="900"
              fontFamily="'Outfit', 'Arial Black', sans-serif"
              transform={`rotate(${item.angle}, ${item.x}, ${item.y})`}
            >
              {item.char}
            </text>
          ))}

          {/* Bottom Arc Characters: ★ NYP SINDH VERIFIED ★ (Upright & Right-Side-Up) */}
          {bottomChars.map((item, idx) => (
            <text
              key={`bottom-${idx}`}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#991b1b"
              fontSize="11.5"
              fontWeight="900"
              fontFamily="'Outfit', 'Arial Black', sans-serif"
              transform={`rotate(${item.angle}, ${item.x}, ${item.y})`}
            >
              {item.char}
            </text>
          ))}
        </svg>

        {/* HTML Image Overlay for Logo inside Stamp Center */}
        <div style={{ position: 'absolute', top: '33%', left: '33%', width: '34%', height: '34%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <img src="/nyp-logo.png" alt="NYP Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>
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



  return (
    <div className="w-full space-y-6">

      {/* Top Action & View Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl no-print shadow-xl space-y-4">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs sm:text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Official Horizontal Membership ID Card (Landscape Design)</span>
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
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${activeTab === 'BOTH'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Both Sides</span>
          </button>

          <button
            onClick={() => setActiveTab('FRONT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${activeTab === 'FRONT'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Front Side Only</span>
          </button>

          <button
            onClick={() => setActiveTab('BACK')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${activeTab === 'BACK'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
              }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Back Side Only</span>
          </button>
        </div>

        {/* Fully Responsive Unclipped Horizontal Card Container */}
      <div
        ref={containerRef}
        className="w-full py-4 flex flex-col items-center justify-center gap-6 min-h-fit max-w-full overflow-hidden px-1"
      >

        {/* ======================================================== */}
        {/* FRONT SIDE OF ID CARD (HORIZONTAL / LANDSCAPE FORMAT)    */}
        {/* ======================================================== */}
        <div
          className={`transition-all duration-300 shrink-0 ${activeTab === 'BACK' ? 'hidden' : 'block'}`}
          style={{
            width: cardScale < 1 ? `${540 * cardScale}px` : '540px',
            height: cardScale < 1 ? `${340 * cardScale}px` : '340px',
            position: 'relative'
          }}
        >
          <div
            ref={frontCardRef}
            className="print-card-front"
            style={{
              width: '540px',
              height: '340px',
              minHeight: '340px',
              transform: cardScale < 1 ? `scale(${cardScale})` : 'none',
              transformOrigin: 'top left',
              background: '#ffffff',
              color: '#0f172a',
              border: '2px solid #cbd5e1',
              borderRadius: '20px',
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
            {/* TOP SECTION: WHITE HEADER WITH EMBLEM, TITLE & SINDH MAP */}
            <div style={{ position: 'relative', zIndex: 10, padding: '12px 16px 2px 16px', background: '#ffffff' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>

                {/* NYP Emblem Logo Left */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '52px', flexShrink: 0 }}>
                  <div style={{ width: '50px', height: '50px', position: 'relative' }}>
                    <img src="/nyp-logo.png" alt="NYP Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                </div>

                {/* Center Title & S I N D H */}
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                  <h1 style={{ color: '#0f172a', fontSize: '14.2px', fontWeight: 900, letterSpacing: '0.1px', margin: 0, padding: 0, textTransform: 'uppercase', lineHeight: 1.15, whiteSpace: 'nowrap', fontFamily: "'Outfit', sans-serif" }}>
                    NATIONAL YOUTH PARLIAMENT
                  </h1>

                  {/* Gold Lines with S I N D H */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', margin: '3px 0' }}>
                    <span style={{ height: '1.8px', background: '#d97706', flex: 1 }}></span>
                    <span style={{ color: '#d97706', fontSize: '11.5px', fontWeight: 900, letterSpacing: '3.5px', whiteSpace: 'nowrap' }}>
                      S I N D H
                    </span>
                    <span style={{ height: '1.8px', background: '#d97706', flex: 1 }}></span>
                  </div>

                  <div style={{ color: '#334155', fontSize: '6.8px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    YOUTH TODAY &nbsp;|&nbsp; A STRONGER PAKISTAN TOMORROW
                  </div>
                </div>

                {/* Sindh Identity Map Logo & Slogan Badge Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  <div style={{ width: '36px', height: '46px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img
                      src="/sindh-identity-logo.png"
                      alt="Sindh Map"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ width: '2px', height: '34px', background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', borderRadius: '1px', flexShrink: 0 }} />
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '6px', marginBottom: '4px' }}>
                <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
                <span style={{ color: '#0f172a', fontSize: '10px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  MEMBERSHIP CARD
                </span>
                <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
              </div>

            </div>

            {/* MAIN BODY: 3 HORIZONTAL COLUMNS (PHOTO LEFT, DETAILS CENTER, SIGNATURES & QR RIGHT) */}
            <div style={{ padding: '2px 16px 4px 16px', display: 'flex', gap: '14px', alignItems: 'stretch', position: 'relative', zIndex: 10, flex: 1 }}>

              {/* COLUMN 1: Member Photo Frame (Gold Double Border) */}
              <div style={{ width: '114px', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '114px',
                    height: '146px',
                    borderRadius: '14px',
                    border: '3.5px solid #d97706',
                    padding: '2.5px',
                    background: '#ffffff',
                    boxShadow: '0 6px 14px -2px rgba(0, 0, 0, 0.14)',
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
                        borderRadius: '9px'
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#e2e8f0', borderRadius: '9px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}>
                      <svg viewBox="0 0 100 120" style={{ width: '85%', height: '85%', fill: '#1e293b' }}>
                        <circle cx="50" cy="38" r="22" />
                        <path d="M10,120 C10,80 30,70 50,70 C70,70 90,80 90,120 Z" />
                        <polygon points="50,70 42,90 58,90" fill="#ffffff" />
                        <polygon points="50,75 46,120 54,120" fill="#0f172a" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* OVERLAPPING OFFICIAL RED STAMP AT BOTTOM RIGHT OF PHOTO */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    right: '-24px',
                    width: '80px',
                    height: '80px',
                    zIndex: 25,
                    pointerEvents: 'none',
                    transform: 'rotate(-10deg)',
                    filter: 'drop-shadow(0px 2px 5px rgba(220, 38, 38, 0.4))'
                  }}
                >
                  <OfficialRedStampSvg />
                </div>
              </div>

              {/* COLUMN 2: Member Information Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', gap: '2px', overflow: 'hidden', minWidth: 0, paddingLeft: '26px' }}>

                <h2 style={{ color: '#0f172a', fontSize: '17px', fontWeight: 900, margin: 0, padding: 0, textTransform: 'uppercase', lineHeight: 1.15, letterSpacing: '-0.2px', wordBreak: 'break-word', fontFamily: "'Outfit', sans-serif" }}>
                  {profile.fullName || 'Abdul Hannan'}
                </h2>

                <div style={{ color: '#022c1e', fontSize: '11.8px', fontWeight: 900, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.2, fontFamily: "'Outfit', sans-serif" }}>
                  {(profile.assignedDesignation || 'JOINT SECRETARY').toUpperCase()}
                </div>

                <div style={{ color: '#065f46', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1.2, marginTop: '1px', fontFamily: "'Outfit', sans-serif" }}>
                  {divisionName || 'Karachi Division'}
                </div>

                {/* Gold Accent Line */}
                <div style={{ width: '42px', height: '2px', background: '#d97706', margin: '4px 0 6px 0' }}></div>

                {/* Key Value Details Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '9.4px', marginTop: '1px' }}>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontWeight: 800, width: '74px', flexShrink: 0 }}>Member ID</span>
                    <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '9.4px', whiteSpace: 'nowrap' }}>: {profile.membershipIdNumber || 'NYPS-2026-3578'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontWeight: 800, width: '74px', flexShrink: 0 }}>CNIC</span>
                    <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '9.4px', whiteSpace: 'nowrap' }}>: {profile.cnicNumber || '33105-7853093-7'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontWeight: 800, width: '74px', flexShrink: 0 }}>Date of Birth</span>
                    <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '9.4px', whiteSpace: 'nowrap' }}>: {formatDateDDMMYYYY(profile.dob) || '01/01/2003'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontWeight: 800, width: '74px', flexShrink: 0 }}>Date of Issue</span>
                    <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '9.4px', whiteSpace: 'nowrap' }}>: {issueDateStr || '18/09/2026'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontWeight: 800, width: '74px', flexShrink: 0 }}>Valid Till</span>
                    <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '9.4px', whiteSpace: 'nowrap' }}>: 31/12/2026</span>
                  </div>

                </div>

              </div>

              {/* COLUMN 3: Signatures (President & Gen Sec) & Verification QR Code */}
              <div style={{ width: '130px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', paddingTop: '16px', paddingLeft: '8px', borderLeft: '1.5px solid #e2e8f0' }}>

                {/* President Signature */}
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px' }}>
                    <img
                      src="/president-signature.png"
                      alt="President Signature"
                      style={{ maxHeight: '22px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ borderTop: '1px solid #0f172a', paddingTop: '1.5px' }}>
                    <div style={{ fontSize: '7.8px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>
                      ABDUL REHMAN HALEPOTO
                    </div>
                    <div style={{ fontSize: '6.2px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                      PRESIDENT
                    </div>
                  </div>
                </div>

                {/* General Secretary Signature */}
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px' }}>
                    <img
                      src="/general-secretary-signature.png"
                      alt="General Secretary Signature"
                      style={{ maxHeight: '22px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ borderTop: '1px solid #0f172a', paddingTop: '1.5px' }}>
                    <div style={{ fontSize: '7.8px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>
                      RAO HUMAYUN
                    </div>
                    <div style={{ fontSize: '6.2px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                      GENERAL SECRETARY
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <div style={{ padding: '2px', background: '#ffffff', borderRadius: '5px', border: '1.2px solid #0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <img src={qrCodeUrl} alt="Verification QR" style={{ width: '40px', height: '40px', display: 'block', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '6px', fontWeight: 800, color: '#1e293b', display: 'block', marginTop: '1px', whiteSpace: 'nowrap' }}>
                    Scan to Verify
                  </span>
                </div>

              </div>

            </div>

            {/* CURVED WAVE DARK GREEN FOOTER BANNER WITH GOLD BORDER */}
            <div style={{ position: 'relative', width: '100%', marginTop: 'auto', zIndex: 10 }}>
              {/* Curved SVG Wave Top with Gold Border Stroke */}
              <svg viewBox="0 0 540 22" style={{ display: 'block', width: '100%', height: '16px' }}>
                <path d="M 0,22 Q 270,-8 540,22 Z" fill="#032e1e" />
                <path d="M 0,22 Q 270,-8 540,22" fill="none" stroke="#d97706" strokeWidth="2.5" />
              </svg>

              {/* Dark Green Footer Banner Body */}
              <div style={{ background: 'linear-gradient(135deg, #022c1e 0%, #064e3b 100%)', color: '#ffffff', padding: '5px 12px 7px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '2.5px', color: '#fbbf24', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  — Y O U T H &nbsp; L E A D I N G &nbsp; F U T U R E —
                </div>
                <div style={{ fontSize: '6.5px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.4px', marginTop: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  EMPOWERING YOUTH &nbsp;|&nbsp; STRENGTHENING SINDH &nbsp;|&nbsp; BUILDING A BRIGHTER TOMORROW
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* BACK SIDE OF ID CARD (HORIZONTAL / LANDSCAPE FORMAT)     */}
        {/* ======================================================== */}
        <div
          className={`transition-all duration-300 shrink-0 ${activeTab === 'FRONT' ? 'hidden' : 'block'}`}
          style={{
            width: cardScale < 1 ? `${540 * cardScale}px` : '540px',
            height: cardScale < 1 ? `${340 * cardScale}px` : '340px',
            position: 'relative'
          }}
        >
          <div
            ref={backCardRef}
            className="print-card-back"
            style={{
              width: '540px',
              height: '340px',
              minHeight: '340px',
              transform: cardScale < 1 ? `scale(${cardScale})` : 'none',
              transformOrigin: 'top left',
              background: '#ffffff',
              color: '#0f172a',
              border: '2px solid #cbd5e1',
              borderRadius: '20px',
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
            {/* Background Watermark Mazar-e-Quaid (Realistic High-Res Photo Landmark Graphic - Shifted Further Right) */}
            <div style={{ position: 'absolute', bottom: '8px', right: '-55px', width: '320px', height: '235px', pointerEvents: 'none', zIndex: 1, opacity: 0.55, mixBlendMode: 'multiply' }}>
              <img src="/mazar-e-quaid.png" alt="Mazar-e-Quaid Karachi" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            {/* TOP SECTION: DARK GREEN HEADER MATCHING REFERENCE BANNER */}
            <div style={{ position: 'relative', zIndex: 10, background: 'linear-gradient(135deg, #022c1e 0%, #043927 50%, #064e3b 100%)', color: '#ffffff', padding: '10px 14px 10px 14px', borderBottom: '2px solid #d97706' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>

                {/* Left: NYP Emblem Logo Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: '48px', height: '48px', background: '#ffffff', borderRadius: '50%', padding: '3px', boxShadow: '0 3px 10px rgba(0,0,0,0.4)', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src="/nyp-logo.png" alt="NYP Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))' }} />
                  </div>
                </div>

                {/* Center: Title, Sindh & Slogan */}
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px' }}>
                  <h2 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 900, letterSpacing: '0.4px', margin: 0, padding: 0, textTransform: 'uppercase', lineHeight: 1.1, whiteSpace: 'nowrap', fontFamily: "'Outfit', sans-serif" }}>
                    NATIONAL YOUTH PARLIAMENT
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '3px 0' }}>
                    <span style={{ height: '1.5px', background: '#f59e0b', flex: 1, maxWidth: '55px' }}></span>
                    <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 900, letterSpacing: '4px', whiteSpace: 'nowrap' }}>
                      S I N D H
                    </span>
                    <span style={{ height: '1.5px', background: '#f59e0b', flex: 1, maxWidth: '55px' }}></span>
                  </div>

                  <div style={{ color: '#ffffff', fontSize: '7.2px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: 0.95 }}>
                    YOUTH TODAY &nbsp;|&nbsp; A STRONGER PAKISTAN TOMORROW
                  </div>
                </div>

                {/* Right: Sindh Map Logo + Amber Bar + SINDH OUR IDENTITY OUR PRIDE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <div style={{ width: '32px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src="/sindh-identity-logo.png"
                      alt="Sindh Map"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(1.1) drop-shadow(0px 1px 2px rgba(0,0,0,0.4))' }}
                    />
                  </div>

                  <div style={{ width: '2px', height: '32px', background: '#f59e0b', borderRadius: '1px' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px', fontFamily: "'Outfit', sans-serif" }}>
                      SINDH
                    </span>
                    <span style={{ fontSize: '6.5px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      OUR IDENTITY
                    </span>
                    <span style={{ fontSize: '6.5px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      OUR PRIDE
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* BACK CARD MIDDLE CONTENT (2 LANDSCAPE COLUMNS) */}
            <div style={{ padding: '10px 20px 8px 20px', flex: 1, display: 'flex', gap: '18px', alignItems: 'stretch', justifyContent: 'space-between', textAlign: 'left', position: 'relative', zIndex: 10 }}>

              {/* LEFT COLUMN: VISION & TERMS & CONDITIONS */}
              <div style={{ width: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>

                {/* OUR VISION */}
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px', display: 'block' }}>
                    O U R &nbsp; V I S I O N
                  </span>
                  <p style={{ fontSize: '10.5px', fontWeight: 800, color: '#1e293b', fontStyle: 'italic', margin: '3px 0 0 0', fontFamily: 'Georgia, serif', lineHeight: 1.35 }}>
                    “A Progressive, Inclusive and Empowered Sindh Led by its Youth”
                  </p>
                </div>

                {/* TERMS & CONDITIONS */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#d97706', textTransform: 'uppercase', letterSpacing: '2px', whiteSpace: 'nowrap' }}>
                      TERMS &amp; CONDITIONS
                    </span>
                    <span style={{ height: '1.5px', background: '#d97706', flex: 1 }}></span>
                  </div>

                  <ol style={{ fontSize: '8.8px', color: '#1e293b', fontWeight: 700, lineHeight: 1.45, margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li>This card is non-transferable and remains property of NYP Sindh.</li>
                    <li>Must abide by the constitution, policies and code of conduct.</li>
                    <li>Produce when required for official purposes.</li>
                    <li>In case of loss, inform NYP Sindh Secretariat immediately.</li>
                  </ol>
                </div>

              </div>

              {/* RIGHT COLUMN: MOTTO & CONTACT LINKS */}
              <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '12px', borderLeft: '1.5px solid #e2e8f0', paddingLeft: '14px', position: 'relative' }}>

                {/* MOTTO BANNER */}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#0f172a', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    D I S C U S S &nbsp;<span style={{ color: '#d97706' }}>|</span>&nbsp; D E B A T E &nbsp;<span style={{ color: '#d97706' }}>|</span>&nbsp; D E L I V E R
                  </div>
                  <div style={{ fontSize: '8.5px', fontWeight: 900, color: '#b45309', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px', whiteSpace: 'nowrap' }}>
                    F O R &nbsp; A &nbsp; B E T T E R &nbsp; S I N D H
                  </div>
                </div>

                {/* CONTACT & SOCIAL MEDIA LINKS */}
                <div style={{ fontSize: '9.5px', color: '#1e293b', fontWeight: 800, display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>

                  {/* Website */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '18px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <span className="pdf-contact-text" style={{ fontSize: '9.5px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', height: '18px', lineHeight: 1 }}>www.nypsindh.org.pk</span>
                  </div>

                  {/* Instagram */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '18px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <span className="pdf-contact-text" style={{ fontSize: '9.5px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', height: '18px', lineHeight: 1 }}>@nypsindh</span>
                  </div>

                  {/* Facebook */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '18px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="#ffffff">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </div>
                    <span className="pdf-contact-text" style={{ fontSize: '9.5px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', height: '18px', lineHeight: 1 }}>National Youth Parliament Sindh</span>
                  </div>

                  {/* LinkedIn */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '18px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="#ffffff">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </div>
                    <span className="pdf-contact-text" style={{ fontSize: '9.5px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', height: '18px', lineHeight: 1 }}>NYPSindh</span>
                  </div>

                </div>

              </div>

            </div>

            {/* CURVED WAVE DARK GREEN FOOTER BANNER WITH GOLD BORDER */}
            <div style={{ position: 'relative', width: '100%', marginTop: 'auto', zIndex: 10 }}>
              {/* Curved SVG Wave Top with Gold Border Stroke */}
              <svg viewBox="0 0 540 22" style={{ display: 'block', width: '100%', height: '16px' }}>
                <path d="M 0,22 Q 270,-8 540,22 Z" fill="#032e1e" />
                <path d="M 0,22 Q 270,-8 540,22" fill="none" stroke="#d97706" strokeWidth="2.5" />
              </svg>

              {/* Dark Green Footer Banner Body */}
              <div style={{ background: 'linear-gradient(135deg, #022c1e 0%, #064e3b 100%)', color: '#ffffff', padding: '5px 12px 7px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '2.5px', color: '#fbbf24', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  — Y O Y H &nbsp; L E A D I N G &nbsp; F U T U R E —
                </div>
                <div style={{ fontSize: '6.5px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.4px', marginTop: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  EMPOWERING YOUTH &nbsp;|&nbsp; STRENGTHENING SINDH &nbsp;|&nbsp; BUILDING A BRIGHTER TOMORROW
                </div>
              </div>
            </div>

          </div>
        </div>    </div>

      </div>

    </div>
  );
};