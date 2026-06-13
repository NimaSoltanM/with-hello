import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { checkAuth, login } from '#/functions/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const { ok } = await checkAuth()
    if (ok) throw redirect({ to: '/admin' })
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ data: { username, password } })
      await navigate({ to: '/admin' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">ورود به پنل ادمین</h1>
          <p className="text-gray-500 text-sm mt-1">فقط برای مدیران سیستم</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              نام کاربری
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-1"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                در حال ورود...
              </>
            ) : (
              'ورود'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
