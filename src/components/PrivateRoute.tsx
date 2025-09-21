import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation()
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const tokenFromUrl = urlParams.get('token')
  const [isProcessing, setIsProcessing] = useState(!!tokenFromUrl)
  
  useEffect(() => {
    if (tokenFromUrl) {
      console.log('Processing token from URL:', tokenFromUrl)
      localStorage.setItem('accessToken', tokenFromUrl)
      
      const userFromUrl = urlParams.get('user')
      if (userFromUrl) {
        try {
          const userInfo = JSON.parse(decodeURIComponent(userFromUrl))
          console.log('Processing user info from URL:', userInfo)
          localStorage.setItem('user', JSON.stringify(userInfo))
        } catch (error) {
          console.error('Error parsing user info:', error)
        }
      }
      
      window.history.replaceState({}, document.title, window.location.pathname)
      
      setIsProcessing(false)
    }
  }, [tokenFromUrl, urlParams])
  if (isProcessing) {
    return <div>Loading...</div>
  }
  
  const token = localStorage.getItem('accessToken')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}
