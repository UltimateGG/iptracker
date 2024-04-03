import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Button, Dropdown, Spinner, TextInput } from 'flowbite-react';
import { Application, SortDirection, SortState, SortType, UserRole } from '../utils/types';
import { HiChevronDown, HiPlus, HiSearch, HiServer } from 'react-icons/hi';
import CreateApplicationModal from './admin/CreateApplicationModal';
import { useMemo, useState } from 'react';
import ApplicationEntry from '../components/ApplicationEntry';
import { FaRegWindowMaximize, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import clsx from 'clsx';

const HomePage = () => {
  const [createApplicationModalOpen, setCreateApplicationModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ direction: SortDirection.DESC, type: SortType.APPLICATION_ID });

  const { user } = useAuth();
  const { applications } = useAppContext();

  const serverCount = useMemo(() => applications?.reduce((acc, app) => acc + app.servers.length, 0), [applications]);
  const sortedApplications = useMemo(() => {
    if (!applications) return null;

    // TODO search by server hostname, ip address, any others useful
    const filtered = applications.filter(app => app.description.toLowerCase().includes(search.toLowerCase()));
    let sorted: Application[] = [];

    switch (sort.type) {
      case SortType.APPLICATION_ID:
        sorted = filtered.sort((a, b) => a.id - b.id);
        break;
      case SortType.CREATED_AT:
        sorted = filtered.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
        break;
      case SortType.MODIFIED_AT:
        sorted = filtered.sort((a, b) => Date.parse(a.modifiedAt) - Date.parse(b.modifiedAt));
        break;
      case SortType.SERVER_COUNT:
        sorted = filtered.sort((a, b) => a.servers.length - b.servers.length);
        break;
    }

    return sort.direction === SortDirection.ASC ? sorted : sorted.reverse();
  }, [applications, search, sort]);

  return (
    <div className="p-4 md:mx-48 dark:text-white">
      {user && (
        <>
          <div className="flex justify-between w-full flex-col sm:flex-row">
            <h2 className="text-2xl font-medium">Welcome back, {user.username}!</h2>

            {user.role === UserRole.ADMIN && (
              <Button size="sm" className="h-min mt-4 sm:mt-0 whitespace-nowrap" onClick={() => setCreateApplicationModalOpen(true)}>
                <HiPlus size={20} className="mr-2" />
                New Application
              </Button>
            )}
          </div>

          {user.role === UserRole.ADMIN ? (
            <div className="flex gap-2 mb-8 mt-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-3xl font-bold">{applications?.length}</p>
                <p className="flex gap-2 items-center text-md mt-1">
                  <FaRegWindowMaximize size={24} />
                  Application{applications?.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 w-[150px]">
                <p className="text-3xl font-bold">{serverCount}</p>
                <p className="flex gap-2 items-center text-md mt-1">
                  <HiServer size={24} />
                  Server{serverCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-4" />
          )}

          <h3 className="text-xl font-medium mb-2">{user.role === UserRole.ADMIN ? 'All' : 'Your'} Applications</h3>
          <div className="flex gap-4 flex-col sm:flex-row">
            <TextInput placeholder="Search applications, server hostname, ip address..." icon={HiSearch} className="w-full sm:mb-6" value={search} onChange={e => setSearch(e.target.value)} />

            <div className="flex mb-6">
              <Button
                color="light"
                className="h-[42px] rounded-r-none"
                title={sort.direction === SortDirection.ASC ? 'Ascending' : 'Descending'}
                onClick={() => setSort(s => ({ ...s, direction: sort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC }))}
              >
                {sort.direction === SortDirection.ASC ? <FaSortAmountUp size={20} /> : <FaSortAmountDown size={20} />}
              </Button>

              <Dropdown
                label=""
                renderTrigger={() => (
                  <div className="h-[42px]">
                    <Button color="light" className="flex items-center justify-between !border-l-0 !rounded-l-none whitespace-nowrap">
                      {sort.type}
                      <HiChevronDown size={20} className="ml-2" />
                    </Button>
                  </div>
                )}
              >
                {Object.values(SortType).map(v => (
                  <Dropdown.Item key={v} onClick={() => setSort(s => ({ ...s, type: v }))} className={clsx(sort.type === v && 'bg-gray-200 dark:bg-gray-500')}>
                    {v}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          </div>
          {!sortedApplications ? (
            <Spinner />
          ) : (
            // TODO scroll container
            <div className="flex flex-col gap-4">
              {sortedApplications.map(app => (
                <ApplicationEntry key={app.id} app={app} />
              ))}
            </div>
          )}
        </>
      )}

      {createApplicationModalOpen && <CreateApplicationModal onClose={() => setCreateApplicationModalOpen(false)} />}
    </div>
  );
};

export default HomePage;
