import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { submitFeedback } from '#/functions/feedback'

export const Route = createFileRoute('/')({ component: FeedbackForm })

function FeedbackForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => setSuccess(false), 4000)
    return () => clearTimeout(t)
  }, [success])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !title.trim() || !body.trim()) return
    setLoading(true)
    try {
      await submitFeedback({
        data: { username: username.trim(), title: title.trim(), body: body.trim() },
      })
      setUsername('')
      setTitle('')
      setBody('')
      setSuccess(true)
      router.invalidate()
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = username.trim() && title.trim() && body.trim()

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">ارسال بازخورد</h1>
      <p className="text-gray-500 text-sm mb-6">
        نظر، پیشنهاد یا مشکل خود را با ما در میان بگذارید.
      </p>

      {success && (
        <div className="mb-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
          <span className="text-lg">✓</span>
          بازخورد شما با موفقیت ثبت شد. متشکریم!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            نام شما
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="مثلاً: علی رضایی"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            عنوان
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان بازخورد را وارد کنید"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="body" className="text-sm font-medium text-gray-700">
              متن بازخورد
            </label>
            <span className="text-xs text-gray-400">{body.length} کاراکتر</span>
          </div>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="توضیحات خود را بنویسید..."
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              در حال ارسال...
            </>
          ) : (
            <>
              <Send size={15} />
              ارسال بازخورد
            </>
          )}
        </button>
      </form>
    </div>
  )
}
