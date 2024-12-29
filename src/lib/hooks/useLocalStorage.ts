export const useLocalStorage = () => {
  const getLocalStorageItem = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (item && (item.startsWith("{") || item.startsWith("["))) {
        return JSON.parse(item);
      }
      return item;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  };

  const setLocalStorageItem = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  };

  const removeLocalStorageItem = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  };

  const clearLocalStorage = () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  };

  return {
    getLocalStorageItem,
    setLocalStorageItem,
    removeLocalStorageItem,
    clearLocalStorage,
  };
};
