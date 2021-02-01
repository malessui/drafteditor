const Button = ({children}) => {
  return (
    <button type="button" className="py-3 px-4 border-r h-full border-gray-200 hover:bg-gray-100 transition-colors">
      {children}
    </button>
  )
}

export default Button