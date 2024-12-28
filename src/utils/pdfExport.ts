import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = async (elementId: string): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return false;
    }

    // Save original styles
    const originalStyles = {
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
    };

    // Remove restrictions for PDF generation
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Restore original styles
    element.style.maxHeight = originalStyles.maxHeight;
    element.style.overflow = originalStyles.overflow;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('financial-report.pdf');

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};