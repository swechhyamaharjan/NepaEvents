import React from 'react';

export const Login = () => {
  return (
    <div className="h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('your-background-image.jpg')" }}>
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login to Account</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
            <input 
              type="text" 
              placeholder="Enter username" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              placeholder="Enter password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 focus:outline-none"
          >
            Log in
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-pink-500 hover:underline text-sm">Forget password?</a>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/create-account" className="text-pink-500 hover:underline">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
};
