// Single source of truth for the announcement details.
//
// These dates previously sat inline in seven components, which is how the site
// ended up showing one set of dates in the header and another in the footer.
// Change them here only.

export const PROGRAM = {
  edition: 'الدورة الخامسة',
  editionShort: 'الدورة 5',
  year: '1448هـ / 2026م',

  registration: {
    label: 'فترة التسجيل',
    from: 'الأربعاء 19 أغسطس 2026م — الساعة 3:00 عصراً',
    to: 'الجمعة 21 أغسطس 2026م — منتصف الليل',
    short: '19 - 21 أغسطس 2026م',
    opensTime: 'الساعة 3:00 عصراً',
    closesTime: 'منتصف ليلة الجمعة',
    // Used to open and close the form automatically. The +02:00 offset is
    // Libya's, stated explicitly so a visitor abroad sees the same window as
    // one in Tripoli. The database enforces the same bounds regardless.
    startsAt: '2026-08-19T15:00:00+02:00',
    // Midnight at the end of Friday, written as Saturday 00:00 so there is no
    // doubt about which side of Friday the deadline falls on.
    endsAt: '2026-08-22T00:00:00+02:00'
  },

  interview: {
    label: 'المقابلة الشخصية',
    date: 'السبت 22 أغسطس 2026م',
    place: 'مقر الهيئة العامة للأوقاف والشؤون الإسلامية، مقابل مسجد بن جابر'
  },

  course: {
    label: 'انطلاق البرنامج',
    from: 'الاثنين 24 أغسطس 2026م',
    to: 'الاثنين 14 سبتمبر 2026م',
    duration: 'ثلاثة أسابيع',
    venue: 'مسجد حي دمشق بمنطقة أبي سليم'
  },

  notice:
    'التسجيل الإلكتروني لا يُعد قبولاً نهائياً، وإنما يخضع المتقدم للشروط والضوابط والمقابلة الشخصية والتقييم من اللجنة المشرفة، ولا يُنظر في الطلبات بعد انتهاء مدة التسجيل.'
} as const;

export type RegistrationWindow = 'before' | 'open' | 'closed';

/** Where "now" falls relative to the published registration window. */
export function registrationWindow(now: Date = new Date()): RegistrationWindow {
  const start = new Date(PROGRAM.registration.startsAt);
  const end = new Date(PROGRAM.registration.endsAt);
  if (now < start) return 'before';
  if (now > end) return 'closed';
  return 'open';
}
