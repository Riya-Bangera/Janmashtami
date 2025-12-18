import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../../routes';

const Header: React.FC = () => {
  const location = useLocation();
  const navigation = routes.filter(route => route.visible !== false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://miaoda-site-img.cdn.bcebos.com/placeholder/code_logo_default.png"
                alt="百度云智大会"
              />
              <span className="ml-2 text-xl font-bold text-white">百度云智大会抽奖系统</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-base font-medium rounded-md transition duration-300 ${
                  location.pathname === item.path
                    ? 'text-white bg-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;