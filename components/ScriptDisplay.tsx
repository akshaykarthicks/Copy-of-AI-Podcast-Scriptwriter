
import React, { useState, useEffect } from 'react';
import Script from 'next/script';

// Declare libraries loaded from CDN to satisfy TypeScript
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface ScriptDisplayProps {
  script: string;
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script: initialScript }) => {
  const [copyText, setCopyText] = useState('Copy Script');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scriptContent, setScriptContent] = useState('');

  useEffect(() => {
    setCopyText('Copy Script');
    setCopySuccess(false);
    
    const formattedScript = initialScript
      .replace(/---/g, '<hr class="border-t-2 border-dashed border-gray-200 my-6" />')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-3 text-[#BE185D]">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-5 mb-2 text-[#6B21A8]">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-1 text-[#A855F7]">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#4A4A4A]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(\r\n|\n|\r)/gm, '<br />')
      .replace(/<br \/>(\s*<br \/>)+/g, '<br /><br />');
      
    setScriptContent(formattedScript);

  }, [initialScript]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(initialScript).then(() => {
      setCopyText('Copied!');
      setCopySuccess(true);
      setTimeout(() => {
        setCopyText('Copy Script');
        setCopySuccess(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyText('Failed to copy');
       setTimeout(() => setCopyText('Copy Script'), 2000);
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const scriptContentElement = document.getElementById('script-content');
    if (!scriptContentElement || !window.jspdf || !window.html2canvas) {
        setIsDownloading(false);
        console.error("Script content element or PDF libraries not found.");
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
        });
        
        const canvas = await window.html2canvas(scriptContentElement, {
            scale: 2,
            logging: false,
            useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        let position = 0;
        let heightLeft = pdfHeight;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save('podcast-script.pdf');
    } catch (err) {
        console.error("Failed to generate PDF", err);
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="lazyOnload" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="lazyOnload" />
      <div id="script-container" className="bg-white border-2 border-dashed border-[#DB2777] rounded-xl p-1 relative">
        <div className="bg-white rounded-[10px]">
          <div id="script-header" className="p-4 sm:p-6 flex flex-wrap gap-3 justify-between items-center border-b-2 border-[#FBCFE8]">
            <h2 className="text-xl font-bold text-[#6B21A8]">Generated Script</h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCopy}
                className={`${copySuccess ? 'bg-green-500' : 'bg-[#DB2777] hover:bg-[#BE185D]'} text-white font-bold py-2 px-4 rounded-lg border-2 border-[#BE185D] transition-colors text-sm shadow-[2px_2px_0_#BE185D] active:shadow-none active:translate-x-px active:translate-y-px`}
              >
                {copyText}
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 border-2 border-[#6B21A8] shadow-[2px_2px_0_#BE185D] active:shadow-none active:translate-x-px active:translate-y-px disabled:bg-purple-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
          <div 
            id="script-content"
            className="p-4 sm:p-6 text-[#4A4A4A] prose max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: scriptContent }}
          />
        </div>
      </div>
    </>
  );
};

export default ScriptDisplay;
