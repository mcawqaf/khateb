import { Registration } from '../types.js';

// Finding applications that may belong to the same person.
//
// Comparing the raw strings misses most real duplicates: the same name gets
// typed with different hamza forms, with or without tashkeel, and phones get
// entered with spaces, with +218, or with a leading zero.
//
// The three signals are not equally strong, and the interface says so rather
// than presenting them all as "duplicates":
//   national id — decisive; the same id is by definition the same person
//   phone       — strong, but families and offices share a handset
//   name        — weak on its own; common names repeat constantly

export type DuplicateReason = 'nationalId' | 'phone' | 'name';

export type DuplicateStrength = 'certain' | 'likely' | 'possible';

export interface DuplicateGroup {
  /** Stable key for React lists. */
  key: string;
  reasons: DuplicateReason[];
  strength: DuplicateStrength;
  /** The value they share, for display. */
  value: string;
  members: Registration[];
}

/** Strip the variation that makes two spellings of one name look different. */
export function normalizeArabic(input: string): string {
  return (input || '')
    .replace(/[ً-ْٰ]/g, '') // tashkeel
    .replace(/ـ/g, '')                // tatweel
    .replace(/[آأإٱ]/g, 'ا') // آ أ إ ٱ -> ا
    .replace(/ى/g, 'ي')          // ى -> ي
    .replace(/ة/g, 'ه')          // ة -> ه
    .replace(/[^ء-ي0-9a-zA-Z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Reduce a phone to comparable digits, tolerating +218 and spacing. */
export function normalizePhone(input: string): string {
  let d = (input || '').replace(/\D/g, '');
  if (d.startsWith('00218')) d = d.slice(5);
  else if (d.startsWith('218')) d = d.slice(3);
  if (d.length === 9 && !d.startsWith('0')) d = '0' + d;
  return d;
}

const REASON_STRENGTH: Record<DuplicateReason, DuplicateStrength> = {
  nationalId: 'certain',
  phone: 'likely',
  name: 'possible'
};

export const REASON_LABEL: Record<DuplicateReason, string> = {
  nationalId: 'الرقم الوطني',
  phone: 'رقم الهاتف',
  name: 'الاسم'
};

export const STRENGTH_LABEL: Record<DuplicateStrength, string> = {
  certain: 'تطابق مؤكد',
  likely: 'تطابق قوي',
  possible: 'تشابه محتمل'
};

function strongest(reasons: DuplicateReason[]): DuplicateStrength {
  if (reasons.includes('nationalId')) return 'certain';
  if (reasons.includes('phone')) return 'likely';
  return 'possible';
}

export function findDuplicates(list: Registration[]): DuplicateGroup[] {
  const byField: { reason: DuplicateReason; keyOf: (r: Registration) => string }[] = [
    { reason: 'nationalId', keyOf: (r) => (r.nationalId || '').replace(/\D/g, '') },
    { reason: 'phone', keyOf: (r) => normalizePhone(r.phone) },
    // Spaces are dropped for the comparison key: عبد الرحمن and عبدالرحمن are
    // the same name, and the joined spelling is at least as common as the
    // separated one. Two genuinely different full names do not collide once
    // spacing is the only difference between them.
    { reason: 'name', keyOf: (r) => normalizeArabic(r.fullName).replace(/\s+/g, '') }
  ];

  // members-signature -> group, so a pair matching on both phone and name is
  // shown once carrying both reasons rather than twice.
  const groups = new Map<string, DuplicateGroup>();

  for (const { reason, keyOf } of byField) {
    const buckets = new Map<string, Registration[]>();
    for (const r of list) {
      const k = keyOf(r);
      if (!k) continue;
      const arr = buckets.get(k);
      if (arr) arr.push(r);
      else buckets.set(k, [r]);
    }

    for (const [rawKey, members] of buckets) {
      if (members.length < 2) continue;
      const signature = members.map((m) => m.id).sort().join('|');
      // The name key has its spaces stripped for comparison, which is
      // unreadable; show the name as the applicant wrote it.
      const value = reason === 'name' ? members[0].fullName : rawKey;
      const existing = groups.get(signature);
      if (existing) {
        if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
        existing.strength = strongest(existing.reasons);
      } else {
        groups.set(signature, {
          key: signature,
          reasons: [reason],
          strength: REASON_STRENGTH[reason],
          value,
          members: [...members].sort((a, b) => a.sequenceNumber - b.sequenceNumber)
        });
      }
    }
  }

  const order: DuplicateStrength[] = ['certain', 'likely', 'possible'];
  return [...groups.values()].sort(
    (a, b) => order.indexOf(a.strength) - order.indexOf(b.strength)
  );
}
