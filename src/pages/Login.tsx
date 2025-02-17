import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/hooks/store'
import { login } from '@/store/slices/authSlice'
import type { LoginCredentials } from '@/types/index'
import { Button } from '@/components/ui'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/'
import { Eye, EyeOff, Mail, Lock, Sun, Moon, ChevronRight } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsLoading(true)
      await dispatch(login(data)).unwrap()
      navigate('/dashboard')
      toast.success('Connexion réussie')
    } catch (error) {
      toast.error('Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light')
  }

  return (
    <div className={`flex flex-col md:flex-row h-screen overflow-hidden ${
      isDarkMode ? 'bg-black text-white' : 'bg-gray-50'
    }`}>
      {/* Left side - Animated branding */}
      <div className={`relative w-full md:w-1/2 p-8 md:p-16 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-orange-600 to-orange-800'
          : 'bg-gradient-to-br from-orange-500 to-orange-600'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent animate-gradient" />
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 transform hover:translate-x-2 transition-all duration-300">
              <div className="w-8 h-8 bg-white rounded-lg transform rotate-45 hover:rotate-90 transition-all duration-500" />
              <div className="font-semibold text-white">
                <div className="transform hover:translate-y-[-2px] transition-transform duration-300">Orange</div>
                <div className="text-sm font-light opacity-90">Digital Center</div>
              </div>
            </div>
            
            <div className="mt-32 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white animate-fade-in-up">
                Orange Digital Center
              </h1>
              <div className="flex items-center mb-4">
                <span className="text-xl md:text-2xl font-light text-white">Sonatel Academy</span>
                <span className="ml-2 text-lg animate-bounce">🎓</span>
              </div>
              <p className="text-xl md:text-2xl font-light italic text-white/90 hover:text-white transition-colors duration-300">
                "Coding For Better Life !"
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            {[16, 8, 12].map((width, i) => (
              <div
                key={i}
                className={`h-1 bg-white/70 hover:bg-white/90 rounded-full transform hover:scale-110 transition-all duration-300`}
                style={{ width: `${width * 4}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Enhanced login form */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center p-8">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-white" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <Card className={`w-full max-w-md ${
          isDarkMode 
            ? 'bg-gray-900/50 border-gray-800'
            : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
              <img
                src="/api/placeholder/120/50"
                alt="Orange Digital Center"
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className={`text-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Accédez à votre espace personnel ODC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="exemple@mail.com"
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500'
                          : 'bg-white border-gray-200'
                      }`}
                      {...register('email', { required: 'Email requis' })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className={`w-full pl-10 pr-12 py-2 rounded-lg border transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500'
                          : 'bg-white border-gray-200'
                      }`}
                      {...register('password', { required: 'Mot de passe requis' })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Se souvenir de moi
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors duration-300"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Pas encore de compte ?{' '}
                  <Link
                    to="/register"
                    className="text-orange-600 hover:text-orange-500 font-medium transition-colors duration-300"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login