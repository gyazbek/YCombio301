'use strict';

/* A simple utility to perform local storage operations */
/* Allows us to extend it in the future */
/* Example usage:
    StorageUtil.local.get("key");
*/
const StorageUtil = (function () {
    return {
        local:
            (function () {
                return {
                    get: function (key) {
                        return localStorage.getItem(key);
                    },
                    set: function (key, value) {
                        try {
                            localStorage.setItem(key, value);
                            return true;
                        } catch (error) {
                            return false;
                        }
                    },
                    delete: function (key) {
                        try {
                            localStorage.removeItem(key);
                            return true;
                        } catch (error) {
                            return false;
                        }
                    }
                }
            })()
    }
})();