import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Directly generates and downloads a branded PDF expense report for a course.
 * Does not invoke browser print dialogs.
 */
export function generateCourseExpensePDF(course, grandTotal) {
  if (!course) return

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Header background banner
  doc.setFillColor(30, 41, 59) // Slate-800
  doc.rect(0, 0, pageWidth, 38, 'F')

  // Top brand name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('EDUCATIONAL FINANCIAL GUIDE (EFG)', 14, 16)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(58, 155, 142) // Teal accent
  doc.text('Tuition & Fees Expense Report', 14, 24)

  doc.setFontSize(8.5)
  doc.setTextColor(203, 213, 225)
  const dateStr = `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
  doc.text(dateStr, pageWidth - 14, 24, { align: 'right' })

  let currentY = 46

  // Course Details
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  const courseTitle = course.acronym ? `${course.name} (${course.acronym})` : course.name
  
  // Wrap text if course title is long
  const splitTitle = doc.splitTextToSize(courseTitle, pageWidth - 90)
  doc.text(splitTitle, 14, currentY)
  currentY += splitTitle.length * 6

  doc.setFontSize(9.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)

  if (course.college?.name) {
    doc.text(`Offered by: ${course.college.name}`, 14, currentY)
    currentY += 5.5
  }

  if (course.years_to_complete) {
    doc.text(`Program Duration: ${course.years_to_complete} Year${course.years_to_complete > 1 ? 's' : ''} Program`, 14, currentY)
    currentY += 5.5
  }

  // Summary box on the top-right
  const boxWidth = 65
  const boxHeight = 22
  const boxX = pageWidth - 14 - boxWidth
  const boxY = 44

  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'FD')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 116, 139)
  doc.text('ESTIMATED GRAND TOTAL', boxX + 5, boxY + 7)

  doc.setFontSize(12)
  doc.setTextColor(230, 126, 34) // Orange
  doc.text(`PHP ${(grandTotal || 0).toLocaleString()}`, boxX + 5, boxY + 16)

  currentY = Math.max(currentY + 4, 72)

  // Tables for each academic year
  const years = course.years_to_complete || 1
  const expenses = course.expenses || []

  for (let year = 1; year <= years; year++) {
    const yearExpenses = expenses.filter(e => e.year_number === year)
    const yearTotal = yearExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

    if (currentY > pageHeight - 45) {
      doc.addPage()
      currentY = 20
    }

    const tableBody = yearExpenses.length > 0
      ? yearExpenses.map(exp => [
          exp.item_name,
          `PHP ${Number(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ])
      : [['No expenses recorded for this year.', '-']]

    autoTable(doc, {
      startY: currentY,
      head: [[`Year ${year} Expenses`, `Subtotal: PHP ${yearTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [58, 155, 142], // EFG teal
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9.5,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3.5,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 55, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    })

    currentY = doc.lastAutoTable.finalY + 6
  }

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(
      'Educational Financial Guide (EFG) • Official Cost Estimate • For academic planning purposes only',
      14,
      pageHeight - 8
    )
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 14,
      pageHeight - 8,
      { align: 'right' }
    )
  }

  // Generate safe filename and trigger direct download
  const safeName = (course.acronym || course.name || 'Expense_Report')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 35)

  doc.save(`EFG_${safeName}_Expenses.pdf`)
}
