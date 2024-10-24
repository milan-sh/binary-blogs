
import { forwardRef, useId } from 'react'

// only can send refrence from parent if using forwardRef, this is used for controlling the element from parent 
const Input = forwardRef(function Input({
    label,
    type="text",
    className="",
    ...props
}, ref){

    const id = useId();
    return (
        <div className='w-full'>
            {/* if level is there only then create label */}
            {label && 
            <label htmlFor={id} className='font-semibold inline-block mb-1 pl-1'>
                {label}
            </label>}
            <input 
            id={id}
            type={type}
            className={`text-black p-2 outline-none border border-black rounded-lg mb-4 w-full ${className}`}
            // now this input can be controlled from parent by sending ref
            ref={ref}
            {...props}
            />
        </div>
    )
})

export default Input
