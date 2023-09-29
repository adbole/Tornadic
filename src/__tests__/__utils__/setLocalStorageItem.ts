export default function setLocalStorageItem<K extends keyof StorageKeysAndTypes>(
    key: K,
    value: StorageKeysAndTypes[K]
) {
    localStorage.setItem(key, JSON.stringify(value));
}
