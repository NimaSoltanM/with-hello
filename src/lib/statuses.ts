export const STATUSES = [
  {
    value: 'registered',
    label: 'ثبت شده',
    badge: 'bg-slate-100 text-slate-600',
    border: 'border-s-slate-400',
  },
  {
    value: 'under_review',
    label: 'در حال بررسی',
    badge: 'bg-amber-100 text-amber-700',
    border: 'border-s-amber-400',
  },
  {
    value: 'resolved',
    label: 'حل شده',
    badge: 'bg-emerald-100 text-emerald-700',
    border: 'border-s-emerald-500',
  },
] as const

export type StatusValue = (typeof STATUSES)[number]['value']

export function getStatus(value: string) {
  return STATUSES.find((s) => s.value === value) ?? STATUSES[0]
}
