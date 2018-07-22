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

/* Track our handler for closing modals so we can close it at any time */
var modalCloseHandler;


/* This method closes any open modal */
function closeOpenModal() {
    if (modalCloseHandler !== undefined) {
        modalCloseHandler(true);
    }
}

/* Method for opening generic modals */
var openModal = function (id) {
    var modalEl = document.getElementById(id);
    var closeBtn = modalEl.querySelector(".close");
    if (modalEl !== null) {
        modalEl.style.display = "block";
    }
    modalCloseHandler = function (event) {
        if (event == true || !event.target.closest(".container") || event.target.closest(".close")) {
            modalEl.style.display = "none";
            /* Unbind click event */
            closeBtn.removeEventListener("click", modalCloseHandler, false);
            modalEl.removeEventListener("click", modalCloseHandler, false);
        }
    }
    closeBtn.addEventListener('click', modalCloseHandler, false);
    modalEl.addEventListener('click', modalCloseHandler, false);
    modalEl.querySelector(".container").addEventListener('click', function (event) {
        modalCloseHandler(event);
    }, false);
};

var setupModals = function(){
    /* Modal handling */
    var modals = document.getElementsByClassName("modal-link");

    /* For every modal link, we add a event listener to open the corresponding element */
    for (var i = 0; i < modals.length; i++) {
        modals[i].addEventListener('click', function () {
            openModal(this.getAttribute("data-modal-ref"))
        }, false);
    }
}

$(function() {
    setupModals();
});