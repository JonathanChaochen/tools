import { useEffect, useRef } from 'react';

// Platform detection helper
const getIsMac = () => {
  if (typeof navigator === 'undefined') return false;
  // Modern way to check platform, falling back to older property if needed
  // @ts-ignore - navigator.userAgentData is experimental but supported in some browsers
  const platform = (navigator.userAgentData?.platform || navigator.platform || navigator.userAgent).toLowerCase();
  return platform.includes('mac');
};

interface KeyboardShortcutOptions {
  key: string;
  ctrl?: boolean;   // "Primary" modifier (Cmd on Mac, Ctrl on Win/Linux)
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;   // Explicit Meta/Cmd key
  callback: () => void;
  preventDefault?: boolean;
}

// Correct logic function to use inside hooks
const checkKeyboardEvent = (event: KeyboardEvent, options: KeyboardShortcutOptions) => {
  const isMac = getIsMac();
  const { key, ctrl = false, shift = false, alt = false, meta = false } = options;
  
  if (event.key.toLowerCase() !== key.toLowerCase()) return false;
  
  const hasShift = event.shiftKey;
  const hasAlt = event.altKey;
  const hasCtrl = event.ctrlKey;
  const hasMeta = event.metaKey;
  
  if (shift !== hasShift) return false;
  if (alt !== hasAlt) return false;
  
  if (ctrl) {
    if (isMac) {
      if (!hasMeta) return false; // Must have Cmd
    } else {
      if (!hasCtrl) return false; // Must have Ctrl
    }
  } else {
    // If abstract Ctrl is NOT requested...
    // We shouldn't have the primary modifier...
    if (isMac) {
       // if not requesting semantic Ctrl, we shouldn't have Meta...
       // UNLESS explicit Meta is requested?
       if (!meta && hasMeta) return false;
    } else {
       if (!hasCtrl) return false; // ensure no Ctrl
    }
  }

  // If explicit meta is requested
  if (meta) {
    if (!hasMeta) return false;
  } else {
    // If meta NOT requested...
    // On Mac, if 'ctrl' was true, we HAVE meta. So we can't fail here.
    if (!ctrl && hasMeta) return false;
    // If ctrl IS true on Mac, hasMeta is true. We don't want to return false.
    // So only fail if !ctrl AND hasMeta.
  }
  
  // Wait, this is getting complicated. Let's simplify.
  
  // Target state:
  // Shift/Alt must match exactly.
  // "ctrl" means "Cmd" on Mac, "Ctrl" on Win.
  // "meta" means "Cmd" on Mac, "Win" on Win.
  
  // So on Mac: Cmd key satisfies BOTH `ctrl` and `meta` requirements.
  // On Win: Ctrl key satisfies `ctrl`. Win key satisfies `meta`.
  
  // If I ask for `ctrl: true` (Save):
  // Mac: Cmd+S. hasMeta=true.
  // Win: Ctrl+S. hasCtrl=true.
  
  const expectedShift = shift;
  const expectedAlt = alt;
  let expectedCtrl = false; // Physical Ctrl
  let expectedMeta = false; // Physical Meta
  
  if (isMac) {
    if (ctrl) expectedMeta = true;
    if (meta) expectedMeta = true;
    // What if I want physical Ctrl on Mac? The API doesn't support it well via 'ctrl'.
    // It assumes 'ctrl' prop = Cmd on Mac.
  } else {
    if (ctrl) expectedCtrl = true;
    if (meta) expectedMeta = true;
  }
  
  if (hasShift !== expectedShift) return false;
  if (hasAlt !== expectedAlt) return false;
  
  // Strict check?
  // If I want Cmd+S, and I press Ctrl+Cmd+S? Should it fail? Yes, usually.
  
  // On Mac:
  // required: Meta.
  // pressed: Meta. 
  // Ctrl? If not expected, should be false.
  
  if (isMac) {
    if (hasMeta !== expectedMeta) return false;
    // We don't have a way to request physical Ctrl on Mac with this API.
    // So we ensure it's NOT pressed.
    if (hasCtrl) return false; 
  } else {
    if (hasCtrl !== expectedCtrl) return false;
    if (hasMeta !== expectedMeta) return false;
  }
  
  return true;
};

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
  // Keep latest callback in ref to avoid re-binding effect
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Use the improved check logic directly here or via helper
      // Helper needs to be inside or stable. 
      // Let's inline the logic or keep it pure outside.
      
      if (checkKeyboardEvent(event, { key, ctrl, shift, alt, meta, callback: callbackRef.current })) {
        if (preventDefault) {
          event.preventDefault();
        }
        callbackRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrl, shift, alt, meta, preventDefault]);
};

/**
 * Hook for registering multiple keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcutOptions[]) => {
  // Use ref for shortcuts to handle inline arrays without memoization requirement from user
  const shortcutsRef = useRef(shortcuts);
  
  // Update ref when shortcuts change deeply (or just on render if we accept overhead, 
  // but better to rely on user passed array identity OR just update ref on every render)
  // If user passes `[{...}]` inline, it changes every render.
  // We want to avoid removing/adding listeners every render.
  
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }); // Update on every render

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcutsRef.current.forEach((options) => {
        const { callback, preventDefault = true } = options;
        
        if (checkKeyboardEvent(event, options)) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array = bind once!
};
