import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsCode} from "react-icons/bs"
import ToolbarButton from "./toolbar-button"
import Button from "./button"

const INLINE_TYPES = [
  { label: (
      <Button>
        <BsTypeBold/>
      </Button>
  ), style: 'BOLD' },
  { label: (
    <Button>
      <BsTypeItalic/>
    </Button>
  ), style: 'ITALIC' },
  { label: (
      <Button>
        <BsTypeUnderline/>
      </Button>
  ), style: 'UNDERLINE' },
  { label: (
      <Button>
        <BsCode/>
      </Button>
  ), style: 'CODE' },
]
 
const InlineControl = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <>
      {
        INLINE_TYPES.map((toolbarItem) => (
          <ToolbarButton
            key={toolbarItem.style}
            active={currentStyle.has(toolbarItem.style)}
            label={toolbarItem.label}
            onToggle={props.onToggle}
            style={toolbarItem.style}
          />
        ))
      }
    </>
  )
}

export default InlineControl