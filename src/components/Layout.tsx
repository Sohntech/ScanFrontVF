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
      <Disclosure as="nav" className="bg-white shadow-md">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 md:h-20 justify-between items-center">
                <div className="flex items-center">
                  <div className="flex flex-shrink-0 items-center">
                    {/* Logo principal avec transition */}
                    <img
                      className="h-8 w-auto md:h-10 transition-transform hover:scale-105"
                      src="https://res.cloudinary.com/dxernpnkd/image/upload/v1740074459/phdwopu68sbb9ige7uic.png"
                      alt="ODC"
                    />
                  </div>
                  <div className="hidden sm:ml-6 md:ml-8 sm:flex sm:space-x-4 md:space-x-8">
                    
                  </div>
                </div>
                <div className="hidden sm:flex sm:items-center">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex items-center rounded-full bg-white p-1 text-sm transition-all hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 focus:outline-none">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                          src={user?.photoUrl || 'https://via.placeholder.com/40'}
                          alt=""
                        />
                        <span className="ml-2 font-medium text-gray-700 hidden sm:inline text-xs md:text-sm">
                          {user?.firstName}
                        </span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setShowLogoutDialog(true)}
                              className={`${
                                active ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                              } block w-full px-4 py-2 text-left text-xs md:text-sm font-medium transition-colors`}
                            >
                              Se déconnecter
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-2 pt-2">
                <Disclosure.Button
                  as={Link}
                  to="/dashboard"
                  className="block border-l-4 border-orange-500 bg-orange-50 py-2 pl-3 pr-4 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-100"
                >
                  <ChartBarIcon className="mr-2 inline-block h-4 w-4" />
                  Tableau de bord
                </Disclosure.Button>
              </div>
              <div className="border-t border-gray-200 pb-3 pt-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user?.photoUrl || 'https://via.placeholder.com/40'}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={() => setShowLogoutDialog(true)}
                    className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-500 transition-colors hover:bg-orange-50 hover:text-orange-600"
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
        <AlertDialogContent className="max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg md:text-xl">Confirmation de déconnexion</AlertDialogTitle>
            <AlertDialogDescription className="text-sm md:text-base">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto text-sm hover:bg-gray-100">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="w-full sm:w-auto text-sm bg-orange-500 text-white hover:bg-orange-600"
            >
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="py-6 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout