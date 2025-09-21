import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 8 characters' })
})

type LoginValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess: (data: any) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  })
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function onSubmit(values: LoginValues) {
    setServerError(null)
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Request failed')
      onSuccess(data)
    } catch (e: any) {
      setServerError(e.message)
    }
  }

  async function handleGoogleLogin() {
    try {
      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'GET',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Google login failed')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Email
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[hsl(var(--muted-foreground))] text-base z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </span>
            <input
              className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg px-3 py-3 pl-10 text-[hsl(var(--foreground))] text-sm outline-none focus:border-[hsl(var(--border))] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-colors placeholder:text-[hsl(var(--muted-foreground))]"
              {...register('email')}
              type="email"
            />
          </div>
          {errors.email && (
            <p className="text-red-300 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Password
            </label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[hsl(var(--muted-foreground))] text-base z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-lock"
              >
                <rect
                  width="18"
                  height="11"
                  x="3"
                  y="11"
                  rx="2"
                  ry="2"
                ></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg px-3 py-3 pl-10 pr-10 text-[hsl(var(--foreground))] text-sm outline-none focus:border-[hsl(var(--border))] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-colors placeholder:text-[hsl(var(--muted-foreground))]"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
            />
            <button
              type="button"
              className="absolute right-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-base z-10"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-eye-off"
                >
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                  <path d="m2 2 20 20" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-eye"
                >
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-300 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="flex items-center gap-3 p-4 bg-red-300 rounded-lg">
            <div className="flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-alert size-[18px] shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
            </div>
            <span className="text-white text-sm font-medium">Email or password is incorrect</span>
          </div>
        )}

        <button
          className="w-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-lg py-3 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          Sign in
        </button>
      </form>

      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-px bg-[hsl(var(--border))]"></div>
        <span className="text-[hsl(var(--muted-foreground))] text-sm">Or continue with</span>
        <div className="flex-1 h-px bg-[hsl(var(--border))]"></div>
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
