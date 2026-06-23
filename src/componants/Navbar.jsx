import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-orange-500" : "text-white hover:text-gray-300"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 transparent/70 ">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="text-white text-xl font-bold">
          Rock
        </div>

        <ul className="flex items-center gap-8">
          <li>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/work" className={linkClass}>
              Work
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
