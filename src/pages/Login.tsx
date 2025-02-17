import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/hooks/store'
import { login } from '@/store/slices/authSlice'
import type { LoginCredentials } from '@/types/index'
import { Button, Input } from '@/components/ui'

function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
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
            Connectez-vous à votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email requis' })}
              error={errors.email?.message}
            />
            
            <Input
              label="Mot de passe"
              type="password"
              {...register('password', { required: 'Mot de passe requis' })}
              error={errors.password?.message}
            />
          </div>

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Se connecter
            </Button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/register"
              className="font-medium text-orange-primary hover:text-orange-dark"
            >
              Pas encore inscrit ? Créer un compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login