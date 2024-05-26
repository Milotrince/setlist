import { writable } from 'svelte/store';

export const darkStore = writable(typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false);
export const fontSizeStore = writable(1);
export const columnsStore = writable(1);
export const scrollSpeedStore = writable(0.1);
export const transposeStore = writable(0);
export const sharpStore = writable(true);