import React from 'react'

//here learning how to create a higher order component so can use this button at different places

function Button({
    //this is text which will be passing
    children,
    //giving default values so if the values are not passes then also it work fine
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = '',
    ...props
}) {
  return (
    //can put here passing styling propeties, any additional props are being passed then spread those.
    <button className={`px-4 py-2 m-auto block ${bgColor} ${textColor} ${className}`} {...props}>
        {children}
    </button>
  )
}

export default Button
