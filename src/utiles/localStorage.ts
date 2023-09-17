export function storeLocalStorageWithExpiry<T>(key: string, obj: T) {
  const now = new Date();
  // Set the expiration date one week from now
  const item = {
    value: obj,
    expiry: now.getTime() + 7 * 24 * 60 * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);

  // if the item doesn't exist, return null
  if (!itemStr) {
    return undefined;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage and return null
    localStorage.removeItem(key);
    return undefined;
  }
  return item.value;
}
