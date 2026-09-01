import { useEffect, useState } from 'react'

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    Boolean(target.closest('[contenteditable="true"]'))
  )
}

export function useKeyboardInput() {
  const [pressedKeys, setPressedKeys] = useState<ReadonlySet<string>>(() => new Set())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return
      setPressedKeys((current) => new Set(current).add(event.code))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return
      setPressedKeys((current) => {
        const next = new Set(current)
        next.delete(event.code)
        return next
      })
    }

    const clearPressedKeys = () => setPressedKeys(new Set())

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', clearPressedKeys)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', clearPressedKeys)
    }
  }, [])

  return { pressedKeys, isPressed: (code: string) => pressedKeys.has(code) }
}
