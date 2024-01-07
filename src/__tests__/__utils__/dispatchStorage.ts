export default function dispatchStorage(key: keyof StorageKeysAndTypes) {
    window.dispatchEvent(new StorageEvent("storage", { key }));
}
