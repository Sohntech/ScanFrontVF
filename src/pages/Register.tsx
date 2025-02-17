import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/hooks/store'
import { register as registerUser } from '@/store/slices/authSlice'
import type { RegisterData } from '@/types/index'
import { UserRole } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/'
import { Button, Input, Select } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'

const referentiels = ['RefDigital', 'DevWeb', 'DevData', 'AWS', 'Hackeuse']

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>()
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: RegisterData) => {
    try {
      setIsLoading(true)
      await dispatch(registerUser({ ...data, role: UserRole.APPRENANT })).unwrap()
      navigate('/dashboard')
      toast.success('Inscription réussie')
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden"
      >
        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="h-12 mb-8"
          >
            <img
              src="/orange.svg"
              alt="Orange Digital Center Logo"
              className="h-full object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h1 className="text-6xl font-bold tracking-tight leading-tight text-white">
              Orange Digital Center
            </h1>
            <p className="text-3xl mt-6 text-orange-100 font-light">
              Sonatel Academy 🎓
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="space-y-8"
          >
            <p className="text-2xl font-light italic text-orange-50">
              "Coding For Better Life !"
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center">
              <img
                className="h-12 w-auto"
                src="/orange.svg"
                alt="Orange"
              />
            </div>
            <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Créer un compte apprenant
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="rounded-md shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    {...register('firstName', { required: 'Prénom requis' })}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Nom"
                    {...register('lastName', { required: 'Nom requis' })}
                    error={errors.lastName?.message}
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  {...register('email', { required: 'Email requis' })}
                  error={errors.email?.message}
                />

                <Input
                  label="Mot de passe"
                  type="password"
                  {...register('password', { 
                    required: 'Mot de passe requis',
                    minLength: { value: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                  })}
                  error={errors.password?.message}
                />

                <Select
                  label="Référentiel"
                  options={referentiels.map(ref => ({ value: ref, label: ref }))}
                  {...register('referentiel', { required: 'Référentiel requis' })}
                  error={errors.referentiel?.message}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    )}
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
                        hover:file:bg-orange-100"
                    />
                  </div>
                  {errors.photo && (
                    <p className="mt-1 text-sm text-red-600">{errors.photo.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
                  S'inscrire
                </Button>
              </div>

              <div className="text-sm text-center">
                <Link
                  to="/login"
                  className="font-medium text-orange-primary hover:text-orange-dark"
                >
                  Déjà inscrit ? Se connecter
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register