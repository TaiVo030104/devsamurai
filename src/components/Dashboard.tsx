import { useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { useEffect, useRef, useState } from "react"

export function Dashboard() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("Dashboard useEffect running...")
    console.log("Current user:", user)
    console.log("localStorage accessToken:", localStorage.getItem("accessToken"))
    console.log("localStorage user:", localStorage.getItem("user"))
    
    const existingToken = localStorage.getItem("accessToken");
    const existingUser = localStorage.getItem("user");
    
    if (existingToken && existingUser) {
      console.log("Token and user found in localStorage, skipping API call")
      return;
    }
    
    console.log("No token or user found, calling refresh API...")
    fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("Refresh API response:", data)
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          console.log("No accessToken in response, redirecting to login")
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Refresh API error:", error)
        navigate("/login");
      });
  }, [navigate, user]);



  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")
      navigate("/login")
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const ContactItem = ({ src, alt, name }: { src: string; alt: string; name: string }) => (
    <div className="flex items-center gap-3 py-2">
      <div className="relative flex overflow-hidden size-4 flex-none shrink-0 rounded-md">
        <img src={src} alt={alt} className="aspect-square size-full" />
      </div>
      <span className="text-sm">{name}</span>
    </div>
  )

  const StatItem = ({ src, alt, name }: { src: string; alt: string; name: string }) => (
    <div className="flex items-center gap-3">
      <div className="relative flex overflow-hidden size-4 flex-none shrink-0 rounded-md">
        <img src={src} alt={alt} className="aspect-square size-full" />
      </div>
      <span className="flex-1 text-sm">{name}</span>
            <span className="text-[hsl(var(--muted-foreground))] text-sm">0</span>
    </div>
  )

  return (
    <div className="flex h-screen w-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="w-60 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] flex flex-col">
       <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-sm text-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="flex items-center justify-between flex-1">
            <span className="font-semibold">{user?.name || "User"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevrons-up-down ml-2 shrink-0 text-[hsl(var(--muted-foreground))]"
            >
              <path d="m7 15 5 5 5-5"></path>
              <path d="m7 9 5-5 5 5"></path>
            </svg>
          </div>
        </div>
      </div>


        <nav className="py-5">
          <a
            href="#"
            className="flex items-center gap-3 px-5 py-3 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors"
          >
            <span className="text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-house size-4 shrink-0 text-[hsl(var(--foreground))]"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </span>
            Home
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-5 py-3 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors"
          >
            <span className="text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-users size-4 shrink-0 text-[hsl(var(--muted-foreground))]"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            Contacts
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-5 py-3 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors"
          >
            <span className="text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-settings size-4 shrink-0 text-[hsl(var(--muted-foreground))]"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </span>
            Settings
          </a>
        </nav>

        <div className="px-5 pb-5">
          <h3 className="text-sm text-[hsl(var(--muted-foreground))] mb-3 tracking-wider">Favorites</h3>
          <ContactItem src="./src/assets/airbnb.png" alt="Airbnb" name="Airbnb" />
          <ContactItem src="./src/assets/google.png" alt="Google" name="Google" />
          <ContactItem src="./src/assets/microsoft.png" alt="Microsoft" name="Microsoft" />
        </div>

        <div className="px-5 pb-3 mt-auto">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] rounded-lg transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Invite member
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] rounded-lg transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-message-circle"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
            </svg>
            Feedback
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="h-px bg-[hsl(var(--border))]"></div>
        </div>

        <div ref={menuRef}>
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-[hsl(var(--accent))] rounded-lg p-2 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{user?.name || "User"}</div>
            </div>
            <span className="text-[hsl(var(--muted-foreground))] text-lg">⋯</span>
          </div>

          {menuOpen && (
            <div className="absolute bottom-16 left-2 w-56 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-[hsl(var(--border))]">
                <div className="font-semibold">{user?.name || "User"}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{user?.email || "user@example.com"}</div>
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-[hsl(var(--accent))]">Profile</button>
              <button className="w-full text-left px-4 py-2 hover:bg-[hsl(var(--accent))]">Billing</button>
              <button
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-[hsl(var(--accent))]"
                onClick={toggleTheme}
              >
                <span>Theme</span>
                {theme === "dark" ? (
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
                    className="lucide lucide-moon shrink-0"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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
                    className="lucide lucide-sun shrink-0"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0-1.414-1.414M6.05 6.05 4.636 4.636" />
                  </svg>
                )}
              </button>

              <button
                className="w-full text-left px-4 py-2 hover:bg-[hsl(var(--accent))]"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[hsl(var(--background))]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <h1 className="text-2xl font-bold">Overview</h1>
        </div>

        <div className="px-6 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-sm font-medium transition-colors">
                1d
              </button>
              <button className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-sm font-medium transition-colors">
                3d
              </button>
              <button className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-sm font-medium transition-colors">
                7d
              </button>
              <button className="text-[hsl(var(--foreground))] text-sm font-medium border-b border-[hsl(var(--foreground))] pb-1">
                30d
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[hsl(var(--muted-foreground))] text-sm">Custom</span>
              <div className="flex items-center gap-2 px-3 py-2 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[hsl(var(--muted-foreground))]"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                <span className="text-[hsl(var(--foreground))] text-sm">Aug 22, 2025 - Sep 21, 2025</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 mx-70 flex flex-col gap-6">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Lead generation</h2>
                <p className="text-[hsl(var(--muted-foreground))]">New contacts added to the pool.</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-[hsl(var(--muted-foreground))] text-sm mb-1">People</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
                
                <div className="h-8 w-px bg-[hsl(var(--border))]"></div>
                
                <div className="text-center">
                  <div className="text-[hsl(var(--muted-foreground))] text-sm mb-1">Companies</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
              </div>
            </div>
            <div className="h-70 bg-[hsl(var(--background))] rounded-lg border border-[hsl(var(--border))]"></div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-5">Most visited contacts</h3>
              <div className="flex flex-col gap-4">
                <StatItem src="./src/assets/nvidia.png" alt="Nvidia" name="Nvidia" />
                <StatItem src="./src/assets/person.png" alt="Person" name="Olivia Weber" />
                <StatItem src="./src/assets/oracle.png" alt="Oracle" name="Oracle" />
                <StatItem src="./src/assets/apple.png" alt="Apple" name="Apple" />
                <StatItem src="./src/assets/spotify.png" alt="Spotify" name="Spotify" />
                <StatItem src="./src/assets/paypal.png" alt="PayPal" name="PayPal" />
              </div>
            </div>

            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-5">Least visited contacts</h3>
              <div className="flex flex-col gap-4">
                <StatItem src="./src/assets/nvidia.png" alt="Nvidia" name="Nvidia" />
                <StatItem src="./src/assets/person.png" alt="Person" name="Olivia Weber" />
                <StatItem src="./src/assets/oracle.png" alt="Oracle" name="Oracle" />
                <StatItem src="./src/assets/apple.png" alt="Apple" name="Apple" />
                <StatItem src="./src/assets/spotify.png" alt="Spotify" name="Spotify" />
                <StatItem src="./src/assets/paypal.png" alt="PayPal" name="PayPal" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
