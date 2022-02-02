import localStore from 'local-storage';

export const ls = {
    set(key, value) {
        localStore(key, value);
    },
    get(key, defaultVal = null) {
        return localStore(key) || defaultVal;
    },
    remove(key) {
        localStore.remove(key);
    },
    clear() {
        localStore.clear()
    }
};