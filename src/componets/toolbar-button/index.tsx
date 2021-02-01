const ToolbarButton = (props) => {
  const onToggle = (e) => {
    e.preventDefault()
    props.onToggle(props.style)
  }

  return (
    <div onClick={onToggle} className={props.active ? "bg-gray-200" : ""}>
      {props.label}
    </div>
  )
}

export default ToolbarButton