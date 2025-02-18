import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/hooks/store';
import { register as registerUser } from '@/store/slices/authSlice';
// import type { RegisterData } from '@/types/index';
import { Card, CardHeader, CardContent, CardDescription,  Button, Input, Label } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mail, Lock, ChevronRight, AlertCircle, User, EyeOff, Eye } from 'lucide-react';

// Define referentials with icons
interface Referential {
  id: string;
  title: string;
  icon: string;
}

const referentials: Referential[] = [
  { id: 'RefDigital', title: 'Ref Digital', icon: '💻' },
  { id: 'DevWeb', title: 'Dev Web', icon: '🌐' },
  { id: 'DevData', title: 'Dev Data', icon: '📊' },
  { id: 'AWS', title: 'AWS', icon: '☁️' },
  { id: 'Hackeuse', title: 'Hackeuse', icon: '👩‍💻' }
];

// Define form data and validation errors interfaces
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  referential: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  referential?: string;
  profilePicture?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    referential: ''
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error when field is being edited
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setValidationErrors(prev => ({ ...prev, profilePicture: undefined }));
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Aucun fichier sélectionné');
    }
  };

  // const removePhoto = () => {
  //   setPreviewUrl('');
  // };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      errors.firstName = 'Prénom requis';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Nom requis';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalide';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Téléphone requis';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Mot de passe requis';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Au moins 8 caractères';
      isValid = false;
    }

    if (!formData.referential) {
      errors.referential = 'Référentiel requis';
      isValid = false;
    }

    if (!previewUrl) {
      errors.profilePicture = 'Photo requise';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      setIsLoading(true);

      const formDataToSend = new FormData();

      // Get the file from the file input
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        formDataToSend.append('photo', fileInput.files[0]);
      }

      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('referentiel', formData.referential);
      formDataToSend.append('role', 'APPRENANT');

      await dispatch(registerUser(formDataToSend)).unwrap();
      navigate('/dashboard');
      toast.success('Inscription réussie');
    } catch (error: any) {
      console.error('Erreur détaillée:', error.response?.data);
      toast.error(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Registration Form Section */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-4 md:p-5 relative"
        >
          <div className="w-full max-w-md relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="w-full border-0 bg-white/80 backdrop-blur-xl shadow-xl shadow-orange-100/30">
                <CardHeader className="space-y-2 p-4 sm:p-5">
                  <CardDescription className="text-center text-gray-500 text-sm">
                    Rejoignez l'espace personnel ODC
                  </CardDescription>

                  {/* Upload de photo de profil */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center gap-2 mt-2"
                  >
                    <div
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden group cursor-pointer bg-orange-100"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 sm:w-10 sm:h-10 text-orange-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <span className="text-xs text-gray-500">
                      Cliquez pour ajouter une photo
                    </span>
                    <AnimatePresence>
                      {validationErrors.profilePicture && (
                        <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors.profilePicture}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-0">
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <motion.div
                      className="space-y-3"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {/* Champs nom et prénom */}
                      <motion.div
                        variants={{
                          hidden: { y: 20, opacity: 0 },
                          visible: { y: 0, opacity: 1 }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                      >
                        <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                          <Label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Prénom</span>
                          </Label>
                          <div className="relative">
                            <Input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-3 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                              placeholder="John"
                            />
                            <AnimatePresence>
                              {validationErrors.firstName && (
                                <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                  className="absolute right-0 top-full mt-1 text-xs text-red-500 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                                  {validationErrors.firstName}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                          <Label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Nom</span>
                          </Label>
                          <div className="relative">
                            <Input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-3 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                              placeholder="Doe"
                            />
                            <AnimatePresence>
                            {validationErrors.lastName && (
                              <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                                className="absolute right-0 top-full mt-1 text-xs text-red-500 flex items-center gap-1"
                              >
                                <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                                {validationErrors.lastName}
                              </motion.div>
                            )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>

                      {/* Champ email */}
                      <motion.div
                        variants={{
                          hidden: { y: 20, opacity: 0 },
                          visible: { y: 0, opacity: 1 }
                        }}
                        className="space-y-1 sm:space-y-1.5 md:space-y-2"
                      >
                        <Label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                          <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>Email</span>
                        </Label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-3 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                            placeholder="exemple@mail.com"
                          />
                          <AnimatePresence>
                          {validationErrors.email && (
                            <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                              className="absolute right-0 top-full mt-1 text-xs text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                              {validationErrors.email}
                            </motion.div>
                          )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                      {/* Password Field */}
                      <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                        <label className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                          <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>Mot de passe</span>
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="********"
                            className="h-9 sm:h-10 md:h-11 lg:h-12 w-full pl-3 pr-10 text-xs sm:text-sm rounded-md border border-gray-200 bg-white/80 focus:bg-white focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all"

                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
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
                            {validationErrors.password && (
                              <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                                className="absolute right-0 top-full mt-1 text-xs text-red-500 flex items-center gap-1"
                              >
                                <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                                {validationErrors.password}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Sélection du référentiel */}
                      <motion.div
                        variants={{
                          hidden: { y: 20, opacity: 0 },
                          visible: { y: 0, opacity: 1 }
                        }}
                        className="space-y-1"
                      >
                        <Label className="block text-gray-700 text-xs sm:text-sm">
                          Choisissez votre référentiel
                        </Label>
                        <div className="grid grid-cols-2 gap-1 sm:gap-2">
                          <AnimatePresence>
                            {referentials.map((ref) => (
                              <motion.button
                                key={ref.id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, referential: ref.id }))}
                                className={`p-1 sm:p-2 rounded-lg text-white text-xs transition-all ${formData.referential === ref.id
                                  ? 'bg-orange-600 shadow-md shadow-orange-200'
                                  : 'bg-orange-400/90 hover:bg-orange-500'
                                  }`}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <span className="text-sm sm:text-base">{ref.icon}</span>
                                  <span className="truncate">{ref.title}</span>
                                </div>
                              </motion.button>
                            ))}
                          </AnimatePresence>
                        </div>
                        <AnimatePresence>
                        {validationErrors.referential && (
                          <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                            className="mt-1 text-xs text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                            {validationErrors.referential}
                          </motion.div>
                        )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>

                    {/* Bouton d'inscription */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="pt-1 sm:pt-2"
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-9 sm:h-10 rounded-lg relative overflow-hidden group bg-gradient-to-r from-orange-400 to-orange-500"
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
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="button-content"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="relative flex items-center justify-center gap-1 text-white font-medium text-sm"
                            >
                              <span>S'inscrire</span>
                              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>

                    {/* Lien de connexion */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-xs text-center mt-2 sm:mt-3 text-gray-500"
                    >
                      Déjà un compte ?{' '}
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/login"
                        className="font-medium text-orange-600 hover:text-orange-700"
                      >
                        Se connecter
                      </motion.a>
                    </motion.p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;