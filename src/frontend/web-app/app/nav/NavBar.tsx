import { getCurrentUser } from '../actions/authActions'
import LoginButton from './LoginButton'
import Logo from './Logo'
import Search from './Search'
import UserActions from './UserActions';

export default async function NavBar() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-50 flex justify-between 
        bg-white p-5 items-center text-grey-800 shadow-md">
        <div className="flex items-center gap-2 text-3xl font-semibold text-red-500">
        <Logo />
        </div>
        <Search />
        {user ?  (
          <UserActions user={user}/>
        ) : (
            <LoginButton />
        )}
    </header>
  )
}
