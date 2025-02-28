import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/hooks/store'
import { login, forgotPassword } from '@/store/slices/authSlice'
import type { LoginCredentials } from '@/types/index'
import { Button } from '@/components/ui/'
import { Input } from '@/components/ui/'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/'
import { Eye, EyeOff, Mail, Lock, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>()
  const { 
    register: registerReset, 
    handleSubmit: handleResetSubmit, 
    formState: { errors: resetErrors } 
  } = useForm<{email: string}>()

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

  const onResetSubmit = async (data: {email: string}) => {
    try {
      setIsLoading(true)
      await dispatch(forgotPassword(data.email)).unwrap()
      setResetEmailSent(true)
      toast.success('Un email de réinitialisation a été envoyé')
      navigate('/reset-password')
    } catch (error) {
      toast.error("Impossible d'envoyer l'email de réinitialisation")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleResetForm = () => {
    setShowResetForm(!showResetForm)
    setResetEmailSent(false)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Branding Section - Optimized for all screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full lg:w-1/2 bg-gradient-to-br from-orange-700 to-orange-400 p-4 sm:p-6 md:p-8 lg:p-12 flex items-center"
        >
          <div className="flex flex-col h-full w-full justify-between max-w-2xl mx-auto">
            {/* Logo Section - Responsive sizing */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex justify-center lg:justify-start"
            >
              <div className="h-8 sm:h-10 md:h-12 lg:h-16">
                <img
                  src="https://womeninbusiness.hub.brussels/content/uploads/2024/07/logo_orangedigitalcenter.png"
                  alt="Orange Digital Center"
                  className="h-full object-contain"
                />
              </div>
            </motion.div>

            {/* Added mobile-visible condensed branding */}
            <div className="flex flex-col items-center lg:hidden mt-4 mb-6 text-white space-y-2">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl font-semibold text-center"
              >
                Orange Digital Center
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm sm:text-base font-light italic text-center"
              >
                "Coding For Better Life !"
              </motion.p>
            </div>

            {/* Main Content - Responsive visibility */}
            <div className="hidden lg:block text-white space-y-6 md:space-y-8">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                  Orange Digital Center
                </h1>
                <div className="flex items-center mt-4">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-light">Sonatel Academy</span>
                  <span className="ml-2 text-xl sm:text-2xl">🎓</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <p className="text-lg sm:text-xl lg:text-2xl font-light italic">
                  "Coding For Better Life !"
                </p>
                <div className="flex gap-4">
                  {[32, 16, 16].map((width, index) => (
                    <motion.div
                      key={index}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                      className={`h-1 sm:h-1.5 ${index === 1 ? 'bg-white' : 'bg-white/30'} rounded-full origin-left`}
                      style={{ width: `${width}px` }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Login/Reset Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 xl:p-12"
        >
          <div className="w-full max-w-md mx-auto">
            <Card className="border-0 shadow-xl shadow-orange-100/30 backdrop-blur-xl bg-white/80 overflow-hidden">
              <CardHeader className="space-y-3 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white to-orange-50/30">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center"
                >
                  <div className="h-8 sm:h-10 md:h-12 lg:h-16">
                    <img
                      src="https://res.cloudinary.com/dxernpnkd/image/upload/v1740074459/phdwopu68sbb9ige7uic.png"
                      alt="Orange Digital Center"
                      className="h-full object-contain"
                    />
                  </div>
                </motion.div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-800">
                  <AnimatePresence mode="wait">
                    {showResetForm ? (
                      <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Réinitialiser le mot de passe
                      </motion.h1>
                    ) : (
                      <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Connexion
                      </motion.h1>
                    )}
                  </AnimatePresence>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base text-center text-gray-500 max-w-xs mx-auto">
                  <AnimatePresence mode="wait">
                    {showResetForm ? (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Entrez votre email pour réinitialiser votre mot de passe
                      </motion.p>
                    ) : (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Accédez à votre espace personnel ODC
                      </motion.p>
                    )}
                  </AnimatePresence>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 md:p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {showResetForm ? (
                    <motion.div
                      key="reset-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {resetEmailSent ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-6 py-4"
                        >
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Email envoyé avec succès</h3>
                            <p className="text-sm text-gray-500">
                              Veuillez vérifier votre boîte de réception pour les instructions de réinitialisation de mot de passe.
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={toggleResetForm}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à la connexion
                          </Button>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-6">
                          <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                            <label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>Email</span>
                            </label>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="exemple@mail.com"
                                className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-3 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                                {...registerReset('email', { 
                                  required: 'Email requis',
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Format d'email invalide"
                                  }
                                })}
                              />
                              <AnimatePresence>
                                {resetErrors.email && (
                                  <motion.span
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="absolute right-0 top-full mt-1 text-xs text-red-500 flex items-center gap-1"
                                  >
                                    <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                    {resetErrors.email.message}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="pt-4 space-y-3">
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className="w-full h-12 rounded-xl relative overflow-hidden group bg-gradient-to-r from-orange-400 to-orange-500"
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              />
                              <AnimatePresence mode="wait">
                                {isLoading ? (
                                  <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="button-content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative flex items-center justify-center gap-2 text-white font-medium"
                                  >
                                    <span>Envoyer les instructions</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Button>
                            <Button
                              type="button"
                              onClick={toggleResetForm}
                              variant="outline"
                              className="w-full h-12 rounded-xl border border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-700"
                            >
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              Retour à la connexion
                            </Button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
                        {/* Email Field */}
                        <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                          <label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Email</span>
                          </label>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="exemple@mail.com"
                              className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-3 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                              {...register('email', { required: 'Email requis' })}
                            />
                            <AnimatePresence>
                              {errors.email && (
                                <motion.span
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="absolute right-0 top-full mt-1 text-xs text-red-500 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                  {errors.email.message}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                          <label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Mot de passe</span>
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-10 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                              {...register('password', { required: 'Mot de passe requis' })}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                              {showPassword ? (
                                <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              ) : (
                                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              )}
                            </button>
                            <AnimatePresence>
                              {errors.password && (
                                <motion.span
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="absolute right-0 top-full mt-1 text-xs text-red-500 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                  {errors.password.message}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex flex-col xs:flex-row sm:flex-row items-start xs:items-center sm:items-center justify-between gap-2 xs:gap-3 sm:gap-3 pt-1 pb-1">
                          <label className="flex items-center gap-1 xs:gap-1.5 sm:gap-1.5 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <Input
                                type="checkbox"
                                className="h-3 w-3 xs:h-3.5 xs:w-3.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 transition-all duration-200 cursor-pointer"
                              />
                              <span className="absolute inset-0 group-hover:bg-orange-100/50 rounded transition-colors duration-200" />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                              Se souvenir de moi
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={toggleResetForm}
                            className="text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors focus:outline-none focus:underline"
                          >
                            Mot de passe oublié ?
                          </button>
                        </div>

                        {/* Login Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="pt-4"
                        >
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl relative overflow-hidden group bg-gradient-to-r from-orange-400 to-orange-500"
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                            <AnimatePresence mode="wait">
                              {isLoading ? (
                                <motion.div
                                  key="loading"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="button-content"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="relative flex items-center justify-center gap-2 text-white font-medium"
                                >
                                  <span>Se connecter</span>
                                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Button>
                        </motion.div>

                        {/* Register Link */}
                        <div className="text-center pt-2 sm:pt-3 md:pt-4">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Pas encore de compte ?{' '}
                            <Link
                              to="/register"
                              className="font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors focus:outline-none focus:underline"
                            >
                              Créer un compte
                            </Link>
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Extra footer for larger screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="hidden md:block text-center mt-6 text-xs text-gray-400"
            >
              <p>© {new Date().getFullYear()} Orange Digital Center. Tous droits réservés.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login