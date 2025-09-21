import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

type SignupValues = z.infer<typeof signupSchema>

interface SignupFormProps {
  onSuccess: (data: any) => void
}

function ConditionItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
      {ok ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      )}
      <span>{label}</span>
    </div>
  )
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) })

  const [_, setPassword] = useState('')
  const [hasMinLength, setHasMinLength] = useState(false)
  const [hasUpperLower, setHasUpperLower] = useState(false)

  function checkPassword(pw: string) {
    setPassword(pw)
    setHasMinLength(pw.length >= 8)
    setHasUpperLower(/[a-z]/.test(pw) && /[A-Z]/.test(pw))
  }

  async function onSubmit(values: SignupValues) {
    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Request failed')
      onSuccess(data)
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function handleGoogleLogin() {
    try {
      const res = await fetch('http://localhost:3000/api/auth/google', {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Google login failed')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Name</label>
          <input
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))]
                       rounded-lg px-3 py-3 text-sm text-[hsl(var(--foreground))]
                       outline-none focus:ring-2 focus:ring-blue-100
                       dark:focus:ring-blue-900/20 transition-colors"
            {...register('name')}
          />
          {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Email</label>
          <input
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))]
                       rounded-lg px-3 py-3 text-sm text-[hsl(var(--foreground))]
                       outline-none focus:ring-2 focus:ring-blue-100
                       dark:focus:ring-blue-900/20 transition-colors"
            {...register('email')}
          />
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Password</label>
          <input
            type="password"
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))]
                       rounded-lg px-3 py-3 text-sm text-[hsl(var(--foreground))]
                       outline-none focus:ring-2 focus:ring-blue-100
                       dark:focus:ring-blue-900/20 transition-colors"
            {...register('password')}
            onChange={(e) => checkPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}

          <div className="mt-1 flex flex-col gap-1">
            <ConditionItem ok={hasMinLength} label="8 or more characters" />
            <ConditionItem ok={hasUpperLower} label="Uppercase and lowercase letters" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))]
                     rounded-lg py-3 text-sm font-semibold transition-opacity
                     hover:opacity-90 disabled:opacity-60"
        >
          Create account
        </button>
      </form>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[hsl(var(--border))]" />
        <span className="text-sm text-[hsl(var(--muted-foreground))]">Or continue with</span>
        <div className="flex-1 h-px bg-[hsl(var(--border))]" />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          className="w-full flex items-center justify-center gap-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg py-3 text-sm font-medium text-[hsl(var(--foreground))] cursor-pointer transition-colors hover:bg-[hsl(var(--accent))]"
          onClick={handleGoogleLogin}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
              1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
              3.28-4.74 3.28-8.09"
            ></path>
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 
              7.28-2.66l-3.57-2.77c-.98.66-2.23 
              1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
              20.53 7.7 23 12 23"
            ></path>
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
              8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
            ></path>
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 
              4.21 1.64l3.15-3.15C17.45 2.09 14.97 
              1 12 1 7.7 1 3.99 3.47 2.18 
              7.07l3.66 2.84c.87-2.6 3.3-4.53 
              6.16-4.53"
            ></path>
          </svg>
          Google
        </button>
        <button
          className="w-full flex items-center justify-center gap-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg py-3 text-sm font-medium text-[hsl(var(--foreground))] cursor-pointer transition-colors hover:bg-[hsl(var(--accent))]"
          onClick={handleGoogleLogin}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21"><path fill="#f25022" d="M1 1h9v9H1z"></path><path fill="#00a4ef" d="M1 11h9v9H1z"></path><path fill="#7fba00" d="M11 1h9v9h-9z"></path><path fill="#ffb900" d="M11 11h9v9h-9z"></path></svg>
          Microsoft
        </button>
      </div>
    </div>
  )
}
