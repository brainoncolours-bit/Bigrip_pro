const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="text-white text-xl font-bold">
          BIGRIP
        </div>

        <ul className="flex items-center gap-8">
          <li>
            <a
              href="/"
              className="text-white text-sm font-medium hover:text-gray-300 transition-colors"
            >
              Home
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;