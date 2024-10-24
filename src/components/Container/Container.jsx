import React from 'react'

//this is a simple container inside this all the main content will be shown
function Container({children}) {
  return (
    <div className='w-full px-4 max-w-7xl mx-auto'>
      {children}
    </div>
  )
}

export default Container
