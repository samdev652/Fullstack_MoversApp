import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            Moving App
          </Link>

          <div className="flex items-center space-x-4">
            {!currentUser ? (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-200">
                  Register
                </Link>
              </>
            ) : (
              <>
                {currentUser.role === 'user' && (
                  <div className="flex items-center space-x-4">
                    <Link to="/user/dashboard" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link to="/user/book-driver" className="hover:text-blue-200">
                      Book Driver
                    </Link>
                    <Link to="/user/orders" className="hover:text-blue-200">
                      My Orders
                    </Link>
                    <Link to="/user/wallet" className="hover:text-blue-200">
                      Wallet
                    </Link>
                    <Link to="/user/notifications" className="hover:text-blue-200">
                      Notifications
                    </Link>
                  </div>
                )}

                {currentUser.role === 'driver' && (
                  <div className="flex items-center space-x-4">
                    <Link to="/driver/dashboard" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link to="/driver/available-orders" className="hover:text-blue-200">
                      Available Orders
                    </Link>
                    <Link to="/driver/orders" className="hover:text-blue-200">
                      My Orders
                    </Link>
                    <Link to="/driver/wallet" className="hover:text-blue-200">
                      Earnings
                    </Link>
                    <Link to="/driver/notifications" className="hover:text-blue-200">
                      Notifications
                    </Link>
                  </div>
                )}

                {currentUser.role === 'admin' && (
                  <div className="flex items-center space-x-4">
                    <Link to="/admin/dashboard" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link to="/admin/manage-users" className="hover:text-blue-200">
                      Users
                    </Link>
                    <Link to="/admin/manage-drivers" className="hover:text-blue-200">
                      Drivers
                    </Link>
                    <Link to="/admin/support-tickets" className="hover:text-blue-200">
                      Support
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;