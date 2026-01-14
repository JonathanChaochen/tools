import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  preventDefault?: boolean;
}

/**
 * Hook for registering keyboard shortcuts
 * Automatically handles Cmd (Mac) vs Ctrl (Windows/Linux)
 */
export const useKeyboardShortcut = ({
  key,
  ctrl = false,
  shift = false,
  alt = false,
  meta = false,
  callback,
  preventDefault = true,
}: KeyboardShortcutOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      // On Mac, Cmd is meta, on Windows/Linux it's ctrl
      const modifierPressed = ctrl ? (isMac ? event.metaKey : event.ctrlKey) : false;
      const metaPressed = meta ? event.metaKey : false;
      const shiftPressed = shift ? event.shiftKey : false;
      const altPressed = alt ? event.altKey : false;

      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const modifiersMatch =
        (ctrl ? modifierPressed : !event.ctrlKey && !event.metaKey) &&
        (shift ? shiftPressed : !event.shiftKey) &&
        (alt ? altPressed : !event.altKey) &&
        (meta ? metaPressed : !meta);

      if (keyMatches && modifiersMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrl, shift, alt, meta, callback, preventDefault]);
};

/**
 * Hook for registering multiple keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: Omit<KeyboardShortcutOptions, 'callback'> & { callback: () => void }[]) => {
  shortcuts.forEach((shortcut) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useKeyboardShortcut(shortcut);
  });
};
