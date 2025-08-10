/**
 * Utility Functions Module
 * Common helper functions and utilities
 */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute on leading edge
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Get browser support information
 * @returns {Object} Browser support object
 */
export function getBrowserSupport() {
  return {
    intersectionObserver: 'IntersectionObserver' in window,
    performanceObserver: 'PerformanceObserver' in window,
    webp: (() => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL ? canvas.toDataURL('image/webp').indexOf('webp') > -1 : false;
    })(),
    lazyLoading: 'loading' in HTMLImageElement.prototype,
    customElements: 'customElements' in window,
    cssCustomProperties: CSS.supports('color', 'var(--test)'),
    serviceWorker: 'serviceWorker' in navigator
  };
}

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback
 */
export function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return fallback;
  }
}

/**
 * Get element's offset relative to document
 * @param {Element} element - Target element
 * @returns {Object} Offset object with top and left properties
 */
export function getElementOffset(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    width: rect.width,
    height: rect.height
  };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Target element
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} Whether element is in viewport
 */
export function isInViewport(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  
  if (threshold === 0) {
    return vertInView && horInView;
  }
  
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  const visibleArea = visibleHeight * visibleWidth;
  const totalArea = rect.height * rect.width;
  
  return (visibleArea / totalArea) >= threshold;
}

/**
 * Smooth scroll to element
 * @param {Element|string} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export function smoothScrollTo(target, options = {}) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    offset: 0
  };

  const finalOptions = { ...defaultOptions, ...options };
  
  if (finalOptions.offset) {
    const elementPosition = getElementOffset(element).top;
    const offsetPosition = elementPosition - finalOptions.offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: finalOptions.behavior
    });
  } else {
    element.scrollIntoView({
      behavior: finalOptions.behavior,
      block: finalOptions.block,
      inline: finalOptions.inline
    });
  }
}

/**
 * Create and dispatch custom event
 * @param {string} eventName - Event name
 * @param {*} detail - Event detail data
 * @param {Element} target - Target element (default: document)
 */
export function dispatchCustomEvent(eventName, detail = null, target = document) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true
  });
  target.dispatchEvent(event);
}

/**
 * Wait for DOM content to be loaded
 * @returns {Promise} Promise that resolves when DOM is ready
 */
export function waitForDOM() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    } else {
      resolve();
    }
  });
}

/**
 * Wait for all images to load
 * @param {Element} container - Container element (default: document)
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export function waitForImages(container = document) {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }
    });
  });
  
  return Promise.all(promises);
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate random ID
 * @param {number} length - ID length
 * @returns {string} Random ID
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get CSS custom property value
 * @param {string} property - CSS custom property name
 * @param {Element} element - Element to get property from (default: document.documentElement)
 * @returns {string} Property value
 */
export function getCSSCustomProperty(property, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}

/**
 * Set CSS custom property value
 * @param {string} property - CSS custom property name
 * @param {string} value - Property value
 * @param {Element} element - Element to set property on (default: document.documentElement)
 */
export function setCSSCustomProperty(property, value, element = document.documentElement) {
  element.style.setProperty(property, value);
}
