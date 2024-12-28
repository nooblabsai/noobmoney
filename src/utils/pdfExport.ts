import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface StyleModification {
  element: HTMLElement;
  originalStyle: string;
  originalColor?: string;
}

export const exportToPDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  const styleModifications: StyleModification[] = [];

  try {
    // Store original styles and apply PDF-optimized styles
    const modifyStyles = () => {
      // Set white background for better contrast
      styleModifications.push({
        element,
        originalStyle: element.getAttribute('style') || '',
      });
      element.setAttribute('style', 'background-color: white !important;');

      // Enhance text visibility
      element.querySelectorAll('p, h1, h2, h3, span, div').forEach((el) => {
        if (el instanceof HTMLElement) {
          styleModifications.push({
            element: el,
            originalStyle: el.getAttribute('style') || '',
            originalColor: window.getComputedStyle(el).color,
          });
          el.style.color = '#000000';
          el.style.opacity = '1';
        }
      });

      // Enhance chart visibility
      element.querySelectorAll('.recharts-line-curve, .recharts-line, .recharts-text').forEach((el) => {
        if (el instanceof SVGElement) {
          const stroke = el.getAttribute('stroke');
          if (stroke) {
            styleModifications.push({
              element: el as unknown as HTMLElement,
              originalStyle: stroke,
            });
            // Use high contrast colors for better visibility
            if (stroke === '#1e3a8a') el.setAttribute('stroke', '#000000');
            else if (stroke === '#16a34a') el.setAttribute('stroke', '#0066CC');
            else if (stroke === '#dc2626') el.setAttribute('stroke', '#CC0000');
          }
          el.setAttribute('stroke-width', '2');
        }
      });

      // Make chart text more visible
      element.querySelectorAll('.recharts-text').forEach((el) => {
        if (el instanceof SVGElement) {
          el.style.fontSize = '12px';
          el.style.fontWeight = 'bold';
        }
      });
    };

    // Restore original styles function
    const restoreStyles = () => {
      styleModifications.forEach(({ element, originalStyle, originalColor }) => {
        if (originalColor) {
          (element as HTMLElement).style.color = originalColor;
        }
        element.setAttribute('style', originalStyle);
      });
    };

    // Apply PDF-optimized styles
    modifyStyles();

    // Capture the content with enhanced quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = `${element.scrollWidth}px`;
          clonedElement.style.height = `${element.scrollHeight}px`;
        }
      },
    });

    // Initialize PDF with A4 dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10; // margin in mm

    // Calculate dimensions maintaining aspect ratio
    const imgWidth = pageWidth - (2 * margin);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Split content into pages if needed
    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;

    while (heightLeft > 0) {
      // Add new page if needed
      if (pageNumber > 1) {
        pdf.addPage();
      }

      // Calculate height for current page
      const currentHeight = Math.min(heightLeft, pageHeight - (2 * margin));
      
      // Create temporary canvas for current page section
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = (currentHeight * canvas.width) / imgWidth;
      
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          (position * canvas.width) / imgWidth,
          canvas.width,
          tempCanvas.height,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );
      }

      // Add image to PDF
      const imgData = tempCanvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, currentHeight);

      heightLeft -= pageHeight - (2 * margin);
      position += pageHeight - (2 * margin);
      pageNumber++;
    }

    // Save the PDF
    pdf.save('financial-report.pdf');

    // Restore original styles
    restoreStyles();

    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    // Restore original styles even if export fails
    restoreStyles();
    return false;
  }
};