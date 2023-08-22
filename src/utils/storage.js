'use strict';

const storage = type => ({
  set(key, value) {
    window[type].setItem(key, JSON.stringify(value));
  },
  get(key, defaultValue) {
    const item = window[type].getItem(key);
    if (item === 'undefined') return defaultValue;
    return JSON.parse(item) || defaultValue;
  },
  remove(key) {
    window[type].removeItem(key);
  },
  clear() {
    window[type].clear();
  },
});

export const local = storage('localStorage');
export const session = storage('sessionStorage');
