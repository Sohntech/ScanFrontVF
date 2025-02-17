import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/hooks/store'
import { register as registerUser } from '@/store/slices/authSlice'
import type { RegisterData } from '@/types/index'
import { UserRole } from '@/types'
import { Card, CardHeader,  CardDescription, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Select } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, ChevronRight, User, Mail, Lock, Book, AlertCircle } from 'lucide-react'

const referentiels = ['RefDigital', 'DevWeb', 'DevData', 'AWS', 'Hackeuse']

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData & {
    photo: FileList;
  }>()
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // Ajout d'un message d'erreur si aucun fichier n'est sélectionné
      toast.error('Aucun fichier sélectionné')
    }
  }

  const removePhoto = () => {
    setPreviewUrl('')
  }

  const onSubmit = async (data: RegisterData & { photo: FileList }) => {
    try {
      setIsLoading(true)
      
      const formData = new FormData();
      formData.append('photo', data.photo[0]);
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('referentiel', data.referentiel);
      formData.append('role', 'APPRENANT');

      // Debug log
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
    
      await dispatch(registerUser(formData)).unwrap();
      navigate('/dashboard');
      toast.success('Inscription réussie');
    } catch (error: any) {
      console.error('Erreur détaillée:', error.response?.data);
      toast.error(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Branding Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full lg:w-1/2 bg-gradient-to-br from-orange-700 to-orange-400 p-4 sm:p-6 lg:p-12"
        >
          <div className="flex flex-col h-full justify-between max-w-2xl mx-auto">
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex justify-center lg:justify-start"
            >
              <div className="h-8 sm:h-12 lg:h-16">
                <img
                  src="/orange.svg"
                  alt="Orange Digital Center"
                  className="h-full object-contain"
                />
              </div>
            </motion.div>

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

        {/* Register Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-6 lg:p-12"
        >
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-xl shadow-orange-100/30 backdrop-blur-xl bg-white/80">
              <CardHeader className="space-y-3 p-4 sm:p-6 lg:p-8">
                
              
                <CardDescription className="text-sm sm:text-base text-center">
                  Creez votre compte
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 lg:p-8">
                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Photo Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-4 ring-orange-100"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-orange-100 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-orange-500" />
                        </div>
                      )}
                    </div>
                    <div className="w-full max-w-xs">
                      <input
                        type="file"
                        accept="image/*"
                        {...register('photo', { required: 'Photo requise' })}
                        onChange={handlePhotoChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-orange-50 file:text-orange-700
                          hover:file:bg-orange-100
                          transition-colors"
                      />
                    </div>
                    {errors.photo && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.photo.message}
                      </motion.span>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                          <User className="w-3.5 h-3.5" />
                          <span>Prénom</span>
                        </label>
                        <div className="relative">
                          <Input
                            {...register('firstName', { required: 'Prénom requis' })}
                            className="h-10 sm:h-12 w-full pl-3 pr-3 text-sm rounded-lg sm:rounded-xl border-gray-200 bg-white/50 focus:bg-white"
                          />
                          {errors.firstName && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute right-0 top-full mt-0.5 text-xs text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.firstName.message}
                            </motion.span>
                          )}
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                          <User className="w-3.5 h-3.5" />
                          <span>Nom</span>
                        </label>
                        <div className="relative">
                          <Input
                            {...register('lastName', { required: 'Nom requis' })}
                            className="h-10 sm:h-12 w-full pl-3 pr-3 text-sm rounded-lg sm:rounded-xl border-gray-200 bg-white/50 focus:bg-white"
                          />
                          {errors.lastName && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute right-0 top-full mt-0.5 text-xs text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.lastName.message}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </label>
                      <div className="relative">
                        <Input
                          type="email"
                          {...register('email', { required: 'Email requis' })}
                          className="h-10 sm:h-12 w-full pl-3 pr-3 text-sm rounded-lg sm:rounded-xl border-gray-200 bg-white/50 focus:bg-white"
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

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Mot de passe</span>
                      </label>
                      <div className="relative">
                        <Input
                          type="password"
                          {...register('password', { 
                            required: 'Mot de passe requis',
                            minLength: { value: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                          })}
                          className="h-10 sm:h-12 w-full pl-3 pr-3 text-sm rounded-lg sm:rounded-xl border-gray-200 bg-white/50 focus:bg-white"
                        />
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

                    {/* Referentiel */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                        <Book className="w-3.5 h-3.5" />
                        <span>Référentiel</span>
                      </label>
                      <div className="relative">
                        <Select
                          options={referentiels.map(ref => ({ value: ref, label: ref }))}
                          {...register('referentiel', { required: 'Référentiel requis' })}
                          className="h-10 sm:h-12 w-full pl-3 pr-3 text-sm rounded-lg sm:rounded-xl border-gray-200 bg-white/50 focus:bg-white"
                        />
                         {errors.referentiel && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute right-0 top-full mt-0.5 text-xs text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {errors.referentiel.message}
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
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
                            <span>S'inscrire</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>

                  {/* Login Link */}
                  <p className="text-xs sm:text-sm text-center text-gray-500 pt-3">
                    Déjà inscrit ?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      Se connecter
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

export default Register