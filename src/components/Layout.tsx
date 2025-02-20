import { Fragment, useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { logout } from '@/store/slices/authSlice'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/AlertDialog"

function Layout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Disclosure as="nav" className="bg-white shadow-lg sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
              <div className="flex h-14 sm:h-16 lg:h-20 justify-between items-center">
                {/* Logo et Navigation Section */}
                <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 sm:h-10 lg:h-12 w-auto transition-transform duration-200 hover:scale-105"
                      src="https://res.cloudinary.com/dxernpnkd/image/upload/v1740074459/phdwopu68sbb9ige7uic.png"
                      alt="ODC"
                    />
                  </div>
                  <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
                    <Link
                      to="/dashboard"
                      className="group flex items-center px-2 py-1 text-sm lg:text-base font-medium text-gray-700 transition-all duration-200 hover:text-orange-600"
                    >
                      <ChartBarIcon className="h-5 w-5 mr-2 group-hover:text-orange-500 transition-colors" />
                      <span className="border-b-2 border-transparent group-hover:border-orange-500 pb-0.5">
                        Tableau de bord
                      </span>
                    </Link>
                  </div>
                </div>

                {/* User Menu - Desktop */}
                <div className="hidden sm:flex items-center">
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-3 rounded-full bg-white p-1.5 transition-all duration-200 hover:bg-orange-50 hover:ring-2 hover:ring-orange-500 focus:outline-none">
                      <img
                        className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover"
                        src={user?.photoUrl || 'https://via.placeholder.com/40'}
                        alt=""
                      />
                      <span className="font-medium text-gray-700 text-sm lg:text-base pr-2">
                        {user?.firstName}
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setShowLogoutDialog(true)}
                              className={`${
                                active ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                              } flex w-full items-center px-4 py-3 text-sm lg:text-base font-medium transition-colors`}
                            >
                              Se déconnecter
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <span className="sr-only">Ouvrir le menu</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-2 px-3 pb-3 pt-2">
                <Disclosure.Button
                  as={Link}
                  to="/dashboard"
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                >
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Tableau de bord</span>
                </Disclosure.Button>
              </div>
              <div className="border-t border-gray-200">
                <div className="flex items-center space-x-3 px-3 py-4">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user?.photoUrl || 'https://via.placeholder.com/40'}
                    alt=""
                  />
                  <div>
                    <div className="text-base font-medium text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="px-2 py-2">
                  <Disclosure.Button
                    as="button"
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Se déconnecter
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md mx-auto rounded-xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Confirmation de déconnexion
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-base text-gray-600">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full rounded-lg px-4 py-2.5 text-base font-medium sm:w-auto hover:bg-gray-100">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-base font-medium text-white sm:w-auto hover:bg-orange-600"
            >
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="py-6 lg:py-10">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout