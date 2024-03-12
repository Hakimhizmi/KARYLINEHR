import jsPDF from 'jspdf';
import image from './Form.jpg';
  
export const Export_form = (data) => {
    const doc = new jsPDF();

    doc.addImage(image, 'PNG', 0, 10, 200, 300, undefined, false);
    doc.setFontSize(12);

    doc.text(`${data.FirstName} ${data.LastName}`, 60, 77);
    doc.text(`${data.HireDate}`, 63, 86);
    doc.text(`${data.Address}`, 50, 96);
    doc.text(`${data.Gender}`, 45, 107);
    doc.text(`${data.DateOfBirth}`, 63, 119);
    doc.text(`${data.PhoneNumber}`, 67, 130);
    doc.text(`${data.Email}`, 45, 140);
    doc.text(`${data.password_M}`, 54, 151);

    doc.save(`${data.FirstName}${data.LastName}.pdf`);
};
  
