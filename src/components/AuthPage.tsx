import { Link } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { useTheme } from '../contexts/ThemeContext'

interface AuthPageProps {
  mode: 'login' | 'signup'
}

export function AuthPage({ mode }: AuthPageProps) {
  const { theme, toggleTheme } = useTheme()

  const handleSuccess = (data: any) => {
    localStorage.setItem('accessToken', data.accessToken)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col transition-colors">
      <div className="pt-15 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-md 
                          border bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.81815 8.36373L12 0L24 24H15.2809L7.81815 8.36373Z"></path>
              <path d="M4.32142 15.3572L8.44635 24H0L4.32142 15.3572Z"></path>
            </svg>
          </div>
          <span className="text-lg font-bold">Acme</span>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] 
                        border border-[hsl(var(--border))] rounded-2xl p-8 shadow-xl transition-colors">

          <h1 className="text-lg font-semibold mb-2">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h1>
          <p className="text-sm mb-8 text-[hsl(var(--muted-foreground))]">
            {mode === 'login'
              ? 'Welcome back! Please sign in to continue.'
              : 'Please fill in the details to get started.'}
          </p>

          {mode === 'login'
            ? <LoginForm onSuccess={handleSuccess} />
            : <SignupForm onSuccess={handleSuccess} />
          }

          <div className="text-center mt-6 text-sm text-[hsl(var(--muted-foreground))]">
            {mode === 'login' ? (
              <>
                <span>Don&apos;t have an account?</span>{' '}
                <Link
                  to="/signup"
                  className="text-[hsl(var(--foreground))] underline font-semibold"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span>Already have an account?</span>{' '}
                <Link
                  to="/login"
                  className="text-[hsl(var(--foreground))] underline font-semibold"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>

        {mode === 'signup' && (
          <div className="text-sm text-[hsl(var(--muted-foreground))] mt-4 max-w-md">
            By signing up, you agree to our{' '}
            <a href="/terms" className="underline text-[hsl(var(--foreground))]">
              Terms of Use
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline text-[hsl(var(--foreground))]">
              Privacy Policy
            </a>
            .<br />
            Need help?{' '}
            <a href="/contact" className="underline text-[hsl(var(--foreground))]">
              Get in touch
            </a>
            .
          </div>
        )}
      </div>


      <button
        className="fixed bottom-2 right-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] 
                    rounded-lg p-2 cursor-pointer text-[hsl(var(--foreground))] text-xl z-50 
                    hover:bg-[hsl(var(--accent))] transition-colors"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path><path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path><path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
        )}
      </button>
    </div>
  )
}
