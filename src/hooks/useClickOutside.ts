import { useEffect, type RefObject } from 'react';

const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  isOpen: boolean
) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, handler, ref]);
};

export default useClickOutside;
