
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to scroll to bottom of a container
export function scrollToBottom(elementRef: React.RefObject<HTMLElement>) {
  if (elementRef.current) {
    elementRef.current.scrollTo({
      top: elementRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }
}

// Function to check if an element is scrolled to the bottom
export function isScrolledToBottom(elementRef: React.RefObject<HTMLElement>, threshold = 100) {
  if (!elementRef.current) return true;
  
  const { scrollTop, scrollHeight, clientHeight } = elementRef.current;
  return scrollHeight - scrollTop - clientHeight <= threshold;
}

// Function to check if an element is at the top
export function isScrolledToTop(elementRef: React.RefObject<HTMLElement>, threshold = 20) {
  if (!elementRef.current) return true;
  
  return elementRef.current.scrollTop <= threshold;
}

// Add a debounce utility for sidebar toggle actions
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
