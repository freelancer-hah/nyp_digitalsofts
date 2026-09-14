import React, { useRef, useState } from 'react';
import { MemberProfile } from '../types';
import { store } from '../services/store';
import { Download, Printer, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  profile: MemberProfile;
}

export const DigitalIdCard: React.FC<Props> = ({ profile }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const divisionName = store.getDivisionName(profile.divisionId);
  const districtName = store.getDistrictName(profile.districtId);

  const handleDownloadPDF = async () => {
    if (!cardRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const frontCardEl = (cardRef.current.querySelector('.print-card-front') as HTMLElement) || cardRef.current;
      
      // Ensure all web fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Convert all images inside card to base64 Data URLs for 100% exact rendering in html2canvas
      const imgElements = Array.from(frontCardEl.querySelectorAll('img'));
      await Promise.all(
        imgElements.map(async (img) => {
          if (!img.src || img.src.startsWith('data:')) return;
          try {
            const resp = await fetch(img.src, { mode: 'cors' });
            const blob = await resp.blob();
            await new Promise((res) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (reader.result) {
                  img.src = reader.result as string;
                }
                res(null);
              };
              reader.readAsDataURL(blob);
            });
          } catch (err) {
            console.warn('Image base64 conversion warning:', err);
          }
        })
      );

      // Pre-wait for images to complete loading
      await Promise.all(
        imgElements.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      const canvas = await html2canvas(frontCardEl, {
        scale: 4, // 4x scale for retina high-definition output
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#012b1d'
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const calculatedWidth = 150; // 150mm width for crisp standard ID card
      const calculatedHeight = (imgProps.height * calculatedWidth) / imgProps.width;
      
      // Center card cleanly on A4 page
      const xPos = (pdfWidth - calculatedWidth) / 2;
      const yPos = (pdfHeight - calculatedHeight) / 2 - 10;
      
      pdf.addImage(imgData, 'PNG', xPos, yPos, calculatedWidth, calculatedHeight, undefined, 'FAST');
      
      const safeId = (profile.membershipIdNumber || profile.cnicNumber).replace(/[^a-zA-Z0-9-]/g, '_');
      pdf.save(`NYP_Sindh_Card_${safeId}.pdf`);
    } catch (e) {
      console.error('PDF generation error:', e);
      alert('Generating PDF failed. Please click "Print Card" and select "Save as PDF".');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    if (!cardRef.current) {
      window.print();
      return;
    }

    try {
      const printWindow = window.open('', '_blank', 'width=800,height=900');
      if (!printWindow) {
        window.print();
        return;
      }

      const frontCardEl = cardRef.current.querySelector('.print-card-front');
      const cardHtml = frontCardEl ? frontCardEl.outerHTML : cardRef.current.innerHTML;
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
                padding: 40px 20px !important;
                margin: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .print-wrapper {
                width: 460px !important;
                margin: 0 auto !important;
              }
              .no-print, .print-card-back {
                display: none !important;
              }
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
            </style>
          </head>
          <body>
            <div class="print-wrapper">
              ${cardHtml}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.focus();
                  window.print();
                  window.close();
                }, 350);
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

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl no-print">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Official Membership Card Unlocked</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Card</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition-colors cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
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

      {/* Physical Card Container (Front & Back) - Printable */}
      <div ref={cardRef} className="id-card-printable-container max-w-md mx-auto space-y-4 p-0 bg-transparent">
        
        {/* FRONT CARD */}
        <div 
          className="print-card-side print-card-front"
          style={{
            width: '460px',
            height: '295px',
            minWidth: '460px',
            minHeight: '295px',
            background: 'linear-gradient(135deg, #012b1d 0%, #0f172a 55%, #022c22 100%)',
            color: '#ffffff',
            border: '2px solid #f59e0b',
            borderRadius: '16px',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            margin: '0 auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          }}
        >
          
          {/* Watermark Logo (Circular centered watermark) */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '210px',
              height: '210px',
              opacity: 0.05,
              pointerEvents: 'none',
              zIndex: 1,
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src="/nyp-logo.jpg" 
              alt="" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }} 
            />
          </div>

          {/* Header Banner */}
          <div 
            style={{
              height: '52px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, #065f46 0%, #047857 50%, #022c22 100%)',
              borderBottom: '2px solid #f59e0b',
              position: 'relative',
              zIndex: 10,
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '2px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img src="/nyp-logo.jpg" alt="NYP Sindh Emblem" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ textTransform: 'uppercase' }}>
                <h3 style={{ color: '#ffffff', fontSize: '11px', fontWeight: 900, letterSpacing: '0.5px', margin: 0, padding: 0, lineHeight: 1.4 }}>
                  NATIONAL YOUTH PARLIAMENT
                </h3>
                <span style={{ color: '#fbbf24', fontSize: '9px', fontWeight: 800, letterSpacing: '2px', marginTop: '2px', display: 'block', lineHeight: 1.4 }}>
                  S I N D H
                </span>
              </div>
            </div>
            <div>
              <span 
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fde68a',
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '8px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Official Member
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div 
            style={{
              padding: '12px 18px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
              flex: 1,
              position: 'relative',
              zIndex: 10
            }}
          >
            
            {/* Photo Column */}
            <div style={{ width: '96px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <img
                src={profile.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={profile.fullName}
                style={{
                  width: '94px',
                  height: '114px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '2px solid #f59e0b',
                  background: '#1e293b',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
              />
              <span style={{ color: '#34d399', fontSize: '9px', fontWeight: 800, marginTop: '5px', letterSpacing: '0.5px', lineHeight: 1.4 }}>
                VERIFIED
              </span>
            </div>

            {/* Member Details Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center', minWidth: 0 }}>
              <div>
                <span style={{ color: '#fde68a', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', lineHeight: 1.4 }}>
                  Full Name
                </span>
                <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 800, margin: 0, padding: '0 0 2px 0', lineHeight: 1.4 }}>
                  {profile.fullName}
                </h4>
              </div>

              <div>
                <span style={{ color: '#94a3b8', fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', lineHeight: 1.4 }}>
                  CNIC Number
                </span>
                <span style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.5px', display: 'block', lineHeight: 1.4, paddingBottom: '2px' }}>
                  {profile.cnicNumber}
                </span>
              </div>

              <div>
                <span style={{ color: '#fbbf24', fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', lineHeight: 1.4 }}>
                  Designation / Role
                </span>
                <span style={{ color: '#6ee7b7', fontSize: '11px', fontWeight: 700, display: 'block', lineHeight: 1.4, paddingBottom: '2px' }}>
                  {profile.assignedDesignation || 'Executive Member'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '2px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: '#94a3b8', fontSize: '8px', textTransform: 'uppercase', display: 'block', lineHeight: 1.4 }}>
                    Division
                  </span>
                  <span style={{ color: '#e2e8f0', fontSize: '10px', fontWeight: 600, display: 'block', lineHeight: 1.4, paddingBottom: '2px' }}>
                    {divisionName}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: '#94a3b8', fontSize: '8px', textTransform: 'uppercase', display: 'block', lineHeight: 1.4 }}>
                    District
                  </span>
                  <span style={{ color: '#e2e8f0', fontSize: '10px', fontWeight: 600, display: 'block', lineHeight: 1.4, paddingBottom: '2px' }}>
                    {districtName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div 
            style={{
              height: '42px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#020617',
              borderTop: '1px solid #1e293b',
              position: 'relative',
              zIndex: 10,
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '8px', display: 'block', lineHeight: 1.3 }}>
                Membership ID
              </span>
              <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.5px', lineHeight: 1.3, paddingBottom: '1px' }}>
                {profile.membershipIdNumber || 'NYP-SINDH-2026-XXXX'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck style={{ width: '16px', height: '16px', color: '#34d399' }} />
              <span style={{ color: '#34d399', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px', lineHeight: 1.4 }}>
                OFFICIAL PASS
              </span>
            </div>
          </div>
        </div>

        {/* BACK CARD */}
        <div 
          className="print-card-side print-card-back no-print"
          style={{
            width: '460px',
            height: '295px',
            minWidth: '460px',
            minHeight: '295px',
            background: '#0f172a',
            color: '#cbd5e1',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '16px',
            boxSizing: 'border-box',
            margin: '16px auto 0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
            <span style={{ color: '#fbbf24', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '9px', lineHeight: 1.4 }}>
              TERMS & AUTHORIZATION • NYP SINDH
            </span>
            <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '10px', lineHeight: 1.4 }}>nypsindh.org.pk</span>
          </div>

          <p style={{ fontSize: '9px', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            This identity card is the official property of the National Youth Parliament Sindh. The holder is bound to respect the constitution, policies, and code of conduct of NYP Sindh.
          </p>

          {/* Signatures */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid #1e293b', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#34d399', fontWeight: 700, fontSize: '12px', height: '20px', lineHeight: 1.4 }}>
                Abdul Rehman Halepoto
              </div>
              <span style={{ fontSize: '8px', color: '#94a3b8', display: 'block', borderTop: '1px solid #334155', paddingTop: '2px', lineHeight: 1.4 }}>
                Abdul Rehman Halepoto<br /><strong style={{ color: '#e2e8f0' }}>President NYP Sindh</strong>
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#fbbf24', fontWeight: 700, fontSize: '12px', height: '20px', lineHeight: 1.4 }}>
                Shakir Chandio
              </div>
              <span style={{ fontSize: '8px', color: '#94a3b8', display: 'block', borderTop: '1px solid #334155', paddingTop: '2px', lineHeight: 1.4 }}>
                Shakir Chandio<br /><strong style={{ color: '#e2e8f0' }}>Management Focal Person</strong>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


