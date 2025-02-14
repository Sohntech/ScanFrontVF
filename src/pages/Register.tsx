import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/hooks/store'
import { register as registerUser } from '@/store/slices/authSlice'
import type { RegisterData } from '@/types'
import { Button, Input, Select } from '@/components/ui'

const referentiels = ['RefDigital', 'DevWeb', 'DevData', 'AWS', 'Hackeuse']

function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterData>()
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
      await dispatch(registerUser({ ...data, role: 'APPRENANT' })).unwrap()
      navigate('/dashboard')
      toast.success('Inscription réussie')
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/orange.svg"
            alt="Orange"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte apprenant
          </h2>
        </div>
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
      </div>
    </div>
  )
}

export default Register