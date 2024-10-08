"use client"
import { formatDate } from '@/lib/dateFormat';
import { jsPDF } from 'jspdf';

const useGenerateOfferPDF = () => {
  const generatePDF = (data:any, phone:string, name: string, qrCode:string) => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 350]
    });

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 800, 350, 'F');

    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(190, 85, 420, 180, 10, 10, 'F');

    const qrCodeUrl = qrCode;
    pdf.addImage(qrCodeUrl, 'PNG', 200, 105, 140, 140);

    const storeLogoUrl = data.store_logo;
    pdf.addImage(storeLogoUrl, 'PNG', 370, 105, 50, 50);

    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(data?.creative?.coupon_code, 370, 170);

    pdf.setFontSize(24);
    pdf.setTextColor(255, 0, 0);
    pdf.text(data?.creative?.title, 370, 190);

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Valid till:', 370, 210);
    pdf.text(formatDate(data?.creative.end_date), 420, 210);

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Name: ${name}`, 370, 230);

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Phone: ${phone}`, 370, 250);

    pdf.save(data?.creative?.title);
  };

  return { generatePDF };
};

export default useGenerateOfferPDF;
