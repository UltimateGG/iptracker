import { Dropdown } from 'flowbite-react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle } from 'flowbite-react-icons/solid';
import { ArrowLeftToBracket } from 'flowbite-react-icons/outline';
import { UserRole } from '../utils/types';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full flex bg-gray-100 px-4 py-2 items-center justify-between border-b border-gray-200 shadow-sm">
      <img src="commerce-logo.png" className="w-full max-w-[230px] h-auto" />

      <Dropdown label="" dismissOnClick={false} renderTrigger={() => <UserCircle size={36} className="cursor-pointer hover:text-stone-800" />}>
        <Dropdown.Header>
          <span className="block truncate text-sm">{user?.username}</span>
          <span className="block text-xs text-gray-300">{user?.role !== undefined ? UserRole[user.role] : ''}</span>
        </Dropdown.Header>

        <Dropdown.Item icon={ArrowLeftToBracket} onClick={logout}>
          Logout
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default NavBar;
