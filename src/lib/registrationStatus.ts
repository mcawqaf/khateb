import { RegistrationStatus } from '../types.js';
import { PROGRAM } from './programInfo.js';

// One description of each status, shared by the supervisor dashboard and the
// applicant's own card. Keeping them apart is how the card ended up printing
// "مسجل بالمنظومة" for every applicant, including rejected ones.
//
// `applicantNote` is what the applicant needs to DO next, not a restatement of
// the label. Colours are chosen to stay legible when the card is printed in
// black and white: each state carries a border and an icon, never colour alone.

export interface StatusPresentation {
  /** Short label, used in tables and badges. */
  label: string;
  /** What this means for the applicant, and what to do next. */
  applicantNote: string;
  /** True once the committee has decided — the applicant can stop refreshing. */
  isFinal: boolean;
  /** Tailwind classes for the applicant-facing block. */
  tone: {
    box: string;
    text: string;
    badge: string;
  };
}

export const STATUS: Record<RegistrationStatus, StatusPresentation> = {
  pending: {
    label: 'قيد التدقيق',
    applicantNote:
      'تم استلام طلبك وتسجيله بنجاح، ولم تبتّ فيه اللجنة بعد. يرجى متابعة حالة الطلب عبر صفحة الاستعلام.',
    isFinal: false,
    tone: {
      box: 'bg-slate-50 border-slate-400',
      text: 'text-slate-800',
      badge: 'bg-slate-200 text-slate-900 border-slate-400'
    }
  },

  under_review: {
    label: 'قيد المراجعة',
    applicantNote:
      'طلبك قيد الدراسة من اللجنة المشرفة. يرجى متابعة حالة الطلب عبر صفحة الاستعلام قبل موعد المقابلة.',
    isFinal: false,
    tone: {
      box: 'bg-amber-50 border-amber-500',
      text: 'text-amber-900',
      badge: 'bg-amber-200 text-amber-950 border-amber-600'
    }
  },

  accepted_initial: {
    label: 'مقبول مبدئياً',
    applicantNote: `طلبك مستوفٍ للشروط مبدئياً. يرجى الحضور للمقابلة الشخصية يوم ${PROGRAM.interview.date} في ${PROGRAM.interview.place}، وإحضار نسخة مطبوعة من هذه البطاقة.`,
    isFinal: false,
    tone: {
      box: 'bg-sky-50 border-sky-600',
      text: 'text-sky-950',
      badge: 'bg-sky-200 text-sky-950 border-sky-700'
    }
  },

  accepted_final: {
    label: 'مقبول نهائياً',
    applicantNote: `تم قبولك نهائياً في البرنامج بعد اجتياز المقابلة الشخصية. يبدأ البرنامج ${PROGRAM.course.from} في ${PROGRAM.course.venue}.`,
    isFinal: true,
    tone: {
      box: 'bg-emerald-50 border-emerald-600',
      text: 'text-emerald-950',
      badge: 'bg-emerald-200 text-emerald-950 border-emerald-700'
    }
  },

  rejected: {
    label: 'غير مطابق للشروط',
    applicantNote:
      'نعتذر، لم يُقبل الطلب لعدم مطابقته الشروط والضوابط المعتمدة. نشكر لك اهتمامك ونتمنى لك التوفيق.',
    isFinal: true,
    tone: {
      box: 'bg-rose-50 border-rose-600',
      text: 'text-rose-950',
      badge: 'bg-rose-200 text-rose-950 border-rose-700'
    }
  }
};

export function statusOf(status: RegistrationStatus | undefined): StatusPresentation {
  return STATUS[status as RegistrationStatus] ?? STATUS.pending;
}
