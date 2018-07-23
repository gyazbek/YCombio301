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
$(function () {
    /* Track our handler for closing modals so we can close it at any time */
    var modalCloseHandler;

    var $app = $("#app");


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

    var setupModals = function () {
        /* Modal handling */
        var modals = document.getElementsByClassName("modal-link");

        /* For every modal link, we add a event listener to open the corresponding element */
        for (var i = 0; i < modals.length; i++) {
            modals[i].addEventListener('click', function () {
                openModal(this.getAttribute("data-modal-ref"))
            }, false);
        }
    }

    var limit_start = 0;

    var loadStories = function (container, type, start, end) {
        var dfd = new $.Deferred();
        var totalCount = 0;
        $.getJSON('https://hacker-news.firebaseio.com/v0/' + type + 'stories.json', function (json) {
            totalCount += Math.min(json.length, end - start);
            for (var i = start; i < Math.min(json.length, end); i++) {
                (function (i) {
                    $.getJSON('https://hacker-news.firebaseio.com/v0/item/' + json[i] + '.json',
                        function (json2) {
                            var $post = $(postTemplate(json2));
                            $post.find(".load-comments-link").click(function () {
                                renderComments(json[i], json2.kids);
                            });
                            container.append($post);
                            totalCount -= 1;
                            if (totalCount == 0) {
                                dfd.resolve();
                            }
                        });
                })(i);
            }
        });
        return dfd.promise();
    }

    var loadComments = function (container, comments) {
        if (comments && comments.length > 0) {
            loadCommentsTree(comments).done(function (data) {
                console.log(data);
                container.append(commentTemplate({
                    items: data
                }));
            });
        }
    }

    function Comment(by, text, items) {
        this.by = by;
        this.text = text;
        this.items = items;
    }

    var loadCommentsTree = function (comments) {
        var dfd = new $.Deferred();
        var nTree = [];
        for (var i = 0; i < comments.length; i++) {

            $.getJSON('https://hacker-news.firebaseio.com/v0/item/' + comments[i] + '.json')
                .fail(function () {
                    dfd.reject()
                })
                .done(function (json2) {
                    var newComment = new Comment(json2.by, json2.text, []);

                    nTree.push(newComment);
                    // if we have sub children
                    if (json2.kids !== undefined && json2.kids.length > 0) {

                        loadCommentsTree(json2.kids).done(function (data) {
                            newComment.items = data;
                        });
                    }

                });

        }
        setTimeout(function () {
            dfd.resolve(nTree)
        }, 2000);
        return dfd.promise();
    }


    var renderHomepage = function () {
        limit_start = 0;
        $app.html(postsTemplate());
        var $ph = $("#posts");
        loadStories($ph, 'top', 0, 20);
        $("#ptype").change(function () {
            $ph.empty();
            loadStories($ph, $(this).val(), limit_start, limit_start + 20);
        });
        $app.find("#loadmore").click(function (e) {
            e.preventDefault();
            limit_start += 10;
            loadStories($ph, $("#ptype").val(), limit_start, limit_start + 20).done(function () {
                $('html, body').scrollTop($(document).height());
            });
        });
    }
    var renderComments = function (id, comments) {
        $.getJSON('https://hacker-news.firebaseio.com/v0/item/' + id + '.json', function (json2) {
            $app.html(commentsTemplate(json2));
            var $ph = $("#comments");
            loadComments($ph, comments);
            $("#back").click(function () {
                renderHomepage();
            });
        });
    }
    $("#logo").click(function () {
        renderHomepage();
    });


    setupModals();
    renderHomepage();
});