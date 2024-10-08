import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      {/* Loader */}
      <div className="loader"></div>
    </div>
  )
}

export default LoadingScreen
