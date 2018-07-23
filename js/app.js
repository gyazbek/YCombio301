"use strict";const StorageUtil=function(){return{local:function(){return{get:function(e){return localStorage.getItem(e)},set:function(e,t){try{return localStorage.setItem(e,t),!0}catch(n){return!1}},"delete":function(e){try{return localStorage.removeItem(e),!0}catch(t){return!1}}}}()}}();$(function(){function e(e,t,n){this.by=e,this.text=t,this.items=n}var t,n=$("#app"),o=function(e){var n=document.getElementById(e),o=n.querySelector(".close");null!==n&&(n.style.display="block"),t=function(e){1!=e&&e.target.closest(".container")&&!e.target.closest(".close")||(n.style.display="none",o.removeEventListener("click",t,!1),n.removeEventListener("click",t,!1))},o.addEventListener("click",t,!1),n.addEventListener("click",t,!1),n.querySelector(".container").addEventListener("click",function(e){t(e)},!1)},c=function(){for(var e=document.getElementsByClassName("modal-link"),t=0;t<e.length;t++)e[t].addEventListener("click",function(){o(this.getAttribute("data-modal-ref"))},!1)},i=0,r=function(e,t,n,o){var c=new $.Deferred,i=0;return $.getJSON("https://hacker-news.firebaseio.com/v0/"+t+"stories.json",function(t){i+=Math.min(t.length,o-n);for(var r=n;r<Math.min(t.length,o);r++)!function(n){$.getJSON("https://hacker-news.firebaseio.com/v0/item/"+t[n]+".json",function(o){var r=$(postTemplate(o));r.find(".load-comments-link").click(function(){u(t[n],o.kids)}),e.append(r),i-=1,0==i&&c.resolve()})}(r)}),c.promise()},s=function(e,t){t&&t.length>0&&l(t).done(function(t){console.log(t),e.append(commentTemplate({items:t}))})},l=function(t){for(var n=new $.Deferred,o=[],c=0;c<t.length;c++)$.getJSON("https://hacker-news.firebaseio.com/v0/item/"+t[c]+".json").fail(function(){n.reject()}).done(function(t){var n=new e(t.by,t.text,[]);o.push(n),void 0!==t.kids&&t.kids.length>0&&l(t.kids).done(function(e){n.items=e})});return setTimeout(function(){n.resolve(o)},2e3),n.promise()},a=function(){i=0,n.html(postsTemplate());var e=$("#posts");r(e,"top",0,20),$("#ptype").change(function(){e.empty(),r(e,$(this).val(),i,i+20)}),n.find("#loadmore").click(function(t){t.preventDefault(),i+=10,r(e,$("#ptype").val(),i,i+20).done(function(){$("html, body").scrollTop($(document).height())})})},u=function(e,t){$.getJSON("https://hacker-news.firebaseio.com/v0/item/"+e+".json",function(e){n.html(commentsTemplate(e));var o=$("#comments");s(o,t),$("#back").click(function(){a()})})};$("#logo").click(function(){a()}),c(),a()});