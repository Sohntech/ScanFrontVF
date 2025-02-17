import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/hooks/store'
import { login } from '@/store/slices/authSlice'
import type { LoginCredentials } from '@/types/index'
import { Button } from '@/components/ui/'
import { Input } from '@/components/ui/'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/'
import { Eye, EyeOff, Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Branding Section - Optimized for mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full lg:w-1/2 bg-gradient-to-br from-orange-700 to-orange-400 p-4 sm:p-6 lg:p-12"
        >
          <div className="flex flex-col h-full justify-between max-w-2xl mx-auto">
            {/* Logo Section - Reduced size on mobile */}
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex justify-center lg:justify-start"
            >
              <div className="h-8 sm:h-12 lg:h-16">
                <img
                  src="https://sonatelacademy.com/wp-content/uploads/2024/11/Logo-ODC-Blanc_1.webp"
                  alt="Orange Digital Center"
                  className="h-full object-contain"
                />
              </div>
            </motion.div>

            {/* Main Content - Hidden on mobile */}
            <div className="hidden lg:block text-white space-y-8">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Orange Digital Center
                </h1>
                <div className="flex items-center mt-4">
                  <span className="text-2xl lg:text-3xl font-light">Sonatel Academy</span>
                  <span className="ml-2 text-2xl">🎓</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <p className="text-xl lg:text-2xl font-light italic">
                  "Coding For Better Life !"
                </p>
                <div className="flex gap-4">
                  {[32, 16, 16].map((width, index) => (
                    <motion.div
                      key={index}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                      className={`h-1.5 w-${width} ${index === 1 ? 'bg-white' : 'bg-white/30'} rounded-full origin-left`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Login Form Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-6 lg:p-12"
        >
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-xl shadow-orange-100/30 backdrop-blur-xl bg-white/80">
              <CardHeader className="space-y-3 p-4 sm:p-6 lg:p-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-orange-100 p-3">
                    <img
                      src="https://sonatelacademy.com/wp-content/uploads/2024/11/Logo-ODC-Blanc_1.webp"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
                  Connexion
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-center">
                  Accédez à votre espace personnel ODC
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {/* Email Field */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="exemple@mail.com"
                        className="h-10 sm:h-12 w-full pl-3 pr-3 text-sm rounded-lg sm:rounded-xl border-gray-200 bg-white/50 focus:bg-white"
                        {...register('email', { required: 'Email requis' })}
                      />
                      {errors.email && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute right-0 top-full mt-0.5 text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.email.message}
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Mot de passe</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="h-10 sm:h-12 w-full pl-3 pr-10 text-sm rounded-lg sm:rounded-xl border-gray-200 bg-white/50 focus:bg-white"
                        {...register('password', { required: 'Mot de passe requis' })}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </button>
                      {errors.password && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute right-0 top-full mt-0.5 text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.password.message}
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <Input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-xs sm:text-sm text-gray-600">Se souvenir de moi</span>
                    </label>
                    <button
                      type="button"
                      className="text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 sm:pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm sm:text-base transition-all duration-300"
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-1.5"
                          >
                            <span>Se connecter</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>

                  {/* Register Link */}
                  <p className="text-xs sm:text-sm text-center text-gray-500 pt-3">
                    Pas encore de compte ?{' '}
                    <Link
                      to="/register"
                      className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      Créer un compte
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login