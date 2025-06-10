import { Link } from 'react-router-dom';


const NavBar = () => {

    return (
        <nav className=' p-4 flex items-center justify-between'>
            {/* LEFT SIDE */}
            sidebarButton
            {/* CENTER */}
            <div className="flex justify-center items-center w-1/3">
                <Link
                    to="/"
                    className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:underline transition"
                >
                    WishMinder
                </Link>
            </div>
            {/* RIGHT SIDE */}
            <div className='flex items-center gap-4' >
                {/* THEME MENU */}
            </div>
        </nav>
    )
}

export default NavBar