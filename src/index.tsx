import React, { useState, useEffect } from "react"
import {Editor, EditorState, RichUtils, convertFromRaw, DefaultDraftBlockRenderMap, convertToRaw } from "draft-js"
import debounce from "lodash.debounce"
import Switch from "../switch"
import "draft-js/dist/Draft.css"
import { DraftEditorStyled } from "./styled"
import InlineControl from "./inline-control"
import BlockControl, { getBlockStyle, blockRenderMap } from "./block-control"

const initialData = {
  blocks: [
    {
      key: '16d0k',
      text: '',
      type: 'unstyled',
      depth: 0,
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
}

type DraftEditorPropTypes = {
  mode?: string,
  name?: string
  onChange?: (value: any) => void,
  value?: string,
  register?: ({}) => any
  type?: string,
  errors?: {}
}

const DraftEditor: React.FC<DraftEditorPropTypes> = ({mode, onChange, name, value, errors, type}) => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(convertFromRaw(initialData)),
  )
  const [toggle, setToggle] = useState(false)

  const isAdvanced = mode === "advanced"

  useEffect(() => {
    setToggle(isAdvanced)
  }, [isAdvanced])

  const saveContent = debounce((content) => {
    onChange(JSON.stringify(content))
  }, 1000)

  const handleChange = state => {
    const contentRaw = convertToRaw(editorState.getCurrentContent())
    saveContent(contentRaw)
    setEditorState(state)
  }

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      handleChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  const toggleBlockType = (blockType) => {
    handleChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    );
  }

  const toggleInlineStyle = (inlineStyle) => {
    handleChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    );
  }

  const switchToggle = e => {
    setToggle(e.target.checked)
  }

  const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

  const variants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -30 },
  }

  return (
    <>
      <DraftEditorStyled className="border border-gray-200 rounded-md relative">
        {
          !isAdvanced ? (
            <div className="absolute right-0 -top-8 z-30">
              <Switch name={type} value={toggle} onCheckedChange={switchToggle}/>
            </div>
          ) : null
        }
        <div className="overflow-hidden relative">
          <AnimatePresence>
            {
              toggle && (
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={variants}
                  exit="closed"
                  className="flex justify-between items-center border-b absolute left-0 right-0 top-0 border-gray-200">
                  <div className="flex">
                    <BlockControl
                      editorState={editorState}
                      onToggle={toggleBlockType}
                    />
                    <InlineControl editorState={editorState} onToggle={toggleInlineStyle}/>
                  </div>
                </motion.div>
              )
            }
          </AnimatePresence>
          {
            toggle ? (
              <Editor
                handleKeyCommand={handleKeyCommand}
                editorState={editorState}
                onChange={handleChange}
                name
                blockRenderMap={extendedBlockRenderMap}
                blockStyleFn={getBlockStyle}
                editorClassName={{minHeight: 120}}
              />
            ) : (
              <textarea className="py-3 w-full rounded-md px-4 focus:outline-none" onChange={onChange} value={value ? value : ""} name={name}/>
            )
          }
        </div>
      </DraftEditorStyled>
      {
      errors && errors[name] ? (
          <p role="alert" className="text-pink-600 mt-1">{errors[name]?.message}</p>
        ) : null
      }
    </>
  )
}

export default DraftEditor
