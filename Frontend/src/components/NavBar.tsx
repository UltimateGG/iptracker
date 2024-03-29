import { Dropdown } from 'flowbite-react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Users } from 'flowbite-react-icons/solid';
import { ArrowLeftToBracket } from 'flowbite-react-icons/outline';
import { UserRole } from '../utils/types';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const NavbarLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const nav = useNavigate();

  return (
    <p
      className={clsx('flex gap-2 items-center transition-colors duration-200 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer', pathname === to && 'border-b-4 border-cyan-500')}
      onClick={() => pathname !== to && nav(to)}
    >
      {children}
    </p>
  );
};

const NavBar = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  // Right now only admin has an extra link so just hide home btn for non-admins
  const getNavLinks = () =>
    user?.role === UserRole.ADMIN ? (
      <div className="flex">
        <NavbarLink to="/">Home</NavbarLink>

        <NavbarLink to="/users">
          <Users /> Manage Users
        </NavbarLink>
      </div>
    ) : null;

  return (
    <>
      <div className="w-full flex flex-col bg-gray-100 dark:bg-gray-800 dark:text-white px-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="commerce-logo.png" className="w-full max-w-[230px] h-auto my-2 cursor-pointer" onClick={() => nav('/')} />

            <div className="hidden sm:block ml-4">{getNavLinks()}</div>
          </div>

          <Dropdown label="" dismissOnClick={false} renderTrigger={() => <UserCircle size={36} className="cursor-pointer hover:text-stone-800 dark:hover:text-stone-300" />}>
            <Dropdown.Header>
              <span className="block truncate text-sm">{user?.username}</span>
              <span className="block text-xs text-gray-300">{user?.role !== undefined ? UserRole[user.role] : ''}</span>
            </Dropdown.Header>

            <Dropdown.Item icon={ArrowLeftToBracket} onClick={logout}>
              Logout
            </Dropdown.Item>
          </Dropdown>
        </div>

        <div className="sm:hidden">{getNavLinks()}</div>
      </div>

      <Outlet />
    </>
  );
};

export default NavBar;
