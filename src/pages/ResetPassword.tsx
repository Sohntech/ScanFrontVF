import { SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import axios from 'axios'
import api from '@/lib/axios'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [resetToken, setResetToken] = useState('') // Le token est saisi par l'utilisateur
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!resetToken) {
      toast.error('Veuillez entrer le token de réinitialisation.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/reset-password', {
        token: resetToken,
        newPassword: password,
      })

      toast.success(response.data.message)
      navigate('/login') // Redirection après succès
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Une erreur est survenue.')
      } else {
        toast.error('Une erreur est survenue.')
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

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

        {/* Reset Password Form Section */}
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
                  Réinitialiser le mot de passe
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base text-center text-gray-500 max-w-xs mx-auto">
                  Entrez votre token de réinitialisation et votre nouveau mot de passe
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 md:p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Champ pour le token */}
                  <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                    <label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                      <span>Token de réinitialisation</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Collez votre token ici"
                        className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-3 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                        value={resetToken}
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setResetToken(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Champ pour le nouveau mot de passe */}
                  <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                    <label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                      <span>Nouveau mot de passe</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez un nouveau mot de passe"
                        className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-10 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                        value={password}
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Champ pour la confirmation du mot de passe */}
                  <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                    <label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                      <span>Confirmer le mot de passe</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-10 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                        value={confirmPassword}
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="pt-4"
                  >
                    <Button type="submit" className="w-full h-12 rounded-xl relative overflow-hidden group bg-gradient-to-r from-orange-400 to-orange-500" disabled={loading}>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      {loading ? (
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
                          <span>Réinitialiser</span>
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}