import type { Workbook } from 'exceljs';
import { Registration } from '../types.js';
import { PROGRAM } from './programInfo.js';
import { statusOf } from './registrationStatus.js';

// The exported sheet mirrors the printed roster: same title block, same
// columns, same ordering, so a supervisor comparing the two is looking at one
// document in two forms.
//
// ExcelJS is imported on demand — it is around a megabyte, and an applicant
// loading the registration form has no use for it.

const NAVY = 'FF08192E';
const GOLD = 'FFC89B48';
const GOLD_SOFT = 'FFF3E7CE';
const BORDER = 'FF7A7A7A';

const STATUS_FILL: Record<string, string> = {
  accepted_final: 'FFD6F0E0',
  accepted_initial: 'FFDCEEFB',
  under_review: 'FFFCEEC8',
  rejected: 'FFF9D7D7',
  pending: 'FFEDEDED'
};

interface Column {
  header: string;
  width: number;
  value: (r: Registration) => string | number;
}

const COLUMNS: Column[] = [
  { header: 'الرقم المتسلسل', width: 16, value: (r) => r.serialNumber },
  { header: 'اسم المتقدم', width: 30, value: (r) => r.fullName },
  { header: 'الرقم الوطني', width: 16, value: (r) => r.nationalId },
  { header: 'رقم الهاتف', width: 14, value: (r) => r.phone },
  { header: 'العمر', width: 7, value: (r) => r.age },
  { header: 'المدينة', width: 14, value: (r) => r.city },
  { header: 'العنوان', width: 28, value: (r) => r.address || '' },
  { header: 'المؤهل العلمي', width: 24, value: (r) => r.educationalLevel || '' },
  { header: 'حفظ القرآن', width: 20, value: (r) => r.quranMemorization || '' },
  { header: 'السكن الداخلي', width: 13, value: (r) => (r.housingNeeded ? 'نعم' : 'لا') },
  { header: 'حالة الطلب', width: 18, value: (r) => statusOf(r.status).label },
  { header: 'ملاحظات المشرف', width: 30, value: (r) => r.supervisorNotes || '' }
];

export async function buildRosterWorkbook(rows: Registration[]): Promise<Workbook> {
  // exceljs ships CommonJS, so the namespace object under ESM carries the real
  // exports on `default`. Both shapes are accepted rather than assuming one.
  const mod = await import('exceljs');
  const ExcelJS = ((mod as unknown as { default?: typeof mod }).default ?? mod);
  const wb = new ExcelJS.Workbook();
  wb.creator = 'الهيئة العامة للأوقاف والشؤون الإسلامية';
  wb.created = new Date();

  const ws = wb.addWorksheet('كشف الطلبة', {
    views: [{ rightToLeft: true, state: 'frozen', ySplit: 6 }],
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 }
    }
  });

  const lastCol = COLUMNS.length;
  const span = (row: number) => `A${row}:${String.fromCharCode(64 + lastCol)}${row}`;

  const title = (row: number, text: string, size: number, bold: boolean, color: string) => {
    ws.mergeCells(span(row));
    const cell = ws.getCell(`A${row}`);
    cell.value = text;
    cell.font = { name: 'Arial', size, bold, color: { argb: color } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(row).height = size + 10;
  };

  title(1, 'الهيئة العامة للأوقاف والشؤون الإسلامية — إدارة الشؤون الثقافية والدعوية', 12, true, NAVY);
  title(2, `كشف الطلبة — برنامج (إعداد) لتأهيل الخطباء، ${PROGRAM.edition} ${PROGRAM.year}`, 14, true, NAVY);
  title(
    3,
    `المقابلة الشخصية: ${PROGRAM.interview.date}  |  انطلاق البرنامج: ${PROGRAM.course.from}  |  المكان: ${PROGRAM.course.venue}`,
    10,
    false,
    'FF444444'
  );
  title(
    4,
    `عدد الطلبة: ${rows.length}  |  تاريخ التصدير: ${new Date().toLocaleDateString('ar-LY')}`,
    10,
    true,
    'FF444444'
  );
  ws.addRow([]);

  const headerRow = ws.addRow(COLUMNS.map((c) => c.header));
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: GOLD_SOFT } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: GOLD } },
      left: { style: 'thin', color: { argb: GOLD } },
      bottom: { style: 'medium', color: { argb: GOLD } },
      right: { style: 'thin', color: { argb: GOLD } }
    };
  });

  rows.forEach((r, i) => {
    const row = ws.addRow(COLUMNS.map((c) => c.value(r)));
    row.height = 22;
    row.eachCell((cell, col) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'hair', color: { argb: BORDER } },
        left: { style: 'hair', color: { argb: BORDER } },
        bottom: { style: 'hair', color: { argb: BORDER } },
        right: { style: 'hair', color: { argb: BORDER } }
      };
      // Banding, so the eye can follow a row across twelve columns.
      if (i % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
      }
      // The status column carries its own colour, matching the card.
      if (col === lastCol - 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: STATUS_FILL[r.status] ?? STATUS_FILL.pending }
        };
        cell.font = { name: 'Arial', size: 10, bold: true };
      }
      // Long free text reads better from the right than centred.
      if (col === 7 || col === lastCol) {
        cell.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true };
      }
    });
  });

  COLUMNS.forEach((c, i) => {
    ws.getColumn(i + 1).width = c.width;
  });

  // Let Excel filter and sort the roster without the title block getting caught.
  ws.autoFilter = {
    from: { row: 6, column: 1 },
    to: { row: 6 + rows.length, column: lastCol }
  };

  return wb;
}

export async function downloadRoster(rows: Registration[]): Promise<void> {
  const wb = await buildRosterWorkbook(rows);
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `كشف_الطلبة_${PROGRAM.edition}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
