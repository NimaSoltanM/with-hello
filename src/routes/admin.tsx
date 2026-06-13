import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Loader2, LogOut, Trash2, User } from 'lucide-react'
import { checkAuth, logout } from '#/functions/auth'
import { deleteFeedback, getFeedbacks, updateFeedbackStatus } from '#/functions/feedback'
import { STATUSES, getStatus } from '#/lib/statuses'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { ok } = await checkAuth()
    if (!ok) throw redirect({ to: '/login' })
  },
  loader: () => getFeedbacks(),
  component: AdminDashboard,
})

function relativeTime(date: Date | string | null) {
  if (!date) return '—'
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'همین الان'
  if (m < 60) return `${m} دقیقه پیش`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} ساعت پیش`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} روز پیش`
  return new Intl.DateTimeFormat('fa-IR').format(new Date(date))
}

function StatusBadge({ value }: { value: string }) {
  const s = getStatus(value)
  return (
    <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${s.badge}`}>
      {s.label}
    </span>
  )
}

function AdminDashboard() {
  const feedbacks = Route.useLoaderData()
  const router = useRouter()
  const [updating, setUpdating] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  const counts = {
    registered: feedbacks.filter((f) => f.status === 'registered').length,
    under_review: feedbacks.filter((f) => f.status === 'under_review').length,
    resolved: feedbacks.filter((f) => f.status === 'resolved').length,
  }

  async function handleStatusChange(id: number, status: string) {
    setUpdating(id)
    try {
      await updateFeedbackStatus({ data: { id, status } })
      router.invalidate()
    } finally {
      setUpdating(null)
    }
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    setConfirmDeleteId(null)
    try {
      await deleteFeedback({ data: { id } })
      router.invalidate()
    } finally {
      setDeleting(null)
    }
  }

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    router.navigate({ to: '/login' })
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">داشبورد ادمین</h1>
          <p className="text-gray-500 text-sm mt-1">مدیریت و پیگیری بازخوردهای دریافتی</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50 mt-1"
        >
          {loggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
          خروج
        </button>
      </div>
      <div className="mb-6" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {STATUSES.map((s) => (
          <div key={s.value} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">
              {counts[s.value as keyof typeof counts]}
            </div>
            <div className={`text-xs font-medium mt-1 ${s.badge.split(' ')[1]}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400 text-sm">
          هنوز بازخوردی ثبت نشده است.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {feedbacks.map((item) => {
            const s = getStatus(item.status)
            const isConfirming = confirmDeleteId === item.id
            const isDeleting = deleting === item.id

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border border-gray-200 border-s-4 ${s.border} shadow-sm p-5 flex flex-col gap-3 transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <User size={12} className="text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-500">{item.username}</span>
                    </div>
                    <h2 className="font-semibold text-gray-800 text-sm leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                  <StatusBadge value={item.status} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-4">
                  <span
                    className="text-xs text-gray-400"
                    title={new Intl.DateTimeFormat('fa-IR', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    }).format(new Date(item.createdAt ?? ''))}
                  >
                    {relativeTime(item.createdAt)}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Delete control */}
                    {isConfirming ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-red-500">حذف شود؟</span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          بله
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-gray-500 hover:underline"
                        >
                          خیر
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        disabled={isDeleting || updating === item.id}
                        title="حذف بازخورد"
                        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        {isDeleting ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    )}

                    {/* Status select */}
                    <div className="flex items-center gap-1.5">
                      {updating === item.id && (
                        <Loader2 size={13} className="animate-spin text-gray-400" />
                      )}
                      <select
                        value={item.status}
                        disabled={updating === item.id || isDeleting}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                      >
                        {STATUSES.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
