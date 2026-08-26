import Logo from './Logo'
import Search from './Search'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 flex justify-between 
        bg-white p-5 items-center text-grey-800 shadow-md">
        <div className="flex items-center gap-2 text-3xl font-semibold text-red-500">
        <Logo />
        </div>
        <Search />
        <div>Login</div>
    </header>
  )
}
