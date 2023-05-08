var bImpersonated = window.location.search.indexOf('IMPERSONATE=Y') > -1;

function GetRootWindow() {
    var wnd = window.top;

    try {
        while (wnd.opener && wnd.opener.top != wnd) {
            wnd = wnd.opener.top;
        }
    }
    catch (ex) { }

    return wnd;
}

var rootWnd = GetRootWindow();
if (rootWnd !== window && !bImpersonated) {
    if (window.location.origin !== window.top.location.origin || window.top.location.href.indexOf('ComponentDesigner.html') === -1) {
        // Refreshing the root window should force close all child windows
        rootWnd.ignoreUnloadMessage = true;
        rootWnd.location.reload();
    }
}

if (window.sessionStorage) sessionStorage.clear();
//if (window.localStorage) localStorage.clear();

// Tries to open a window and showsw a message if we can't
// Returns true if there is a popup blocker
function DetectPopupBlocker() {
    var myTest;
    var res = false;
    myTest = window.open("about:blank", "", "directories=no,height=100,width=100,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no");

    if (!myTest) {
        res = true;
    }
    else {
        myTest.close();
    }
    return res;
} //DetectPopupBlocker

function ManualPopup() {
    var popupSpan;
    if (DetectPopupBlocker()) {
        alert('A popup blocker has been detected');
        popupSpan = document.getElementById("POPUP_ERROR");
        popupSpan.style.display = "block";
    }
    else {
        alert('No popup blocker has been detected');
    }

    return false;
} //ManualPopup

// Displays a message if the popup blocker is detected
function DetectPopupBlockerOnLoad() {
    var popupSpan;
    if (CheckForPopup('RT_POPUP')) {
        if (DetectPopupBlocker()) {
            popupSpan = document.getElementById("POPUP_ERROR");
            popupSpan.style.display = "block";
        }
        else {
            CreateCookie('RT_POPUP', 1, 1);
        }
    }
    return false;
} //DetectPopupBlockerOnLoad

var bCanAddFavorite = window.external && ('AddFavorite' in window.external);
function AddFavorite() {
    if (bCanAddFavorite) {
        window.external.Addfavorite(window.location.href, document.title)
    }
    else {
        alert("I'm sorry, your browser does not support adding to favorites.  Please refer to your browser's help file " +
            "to learn how to bookmark a page.");
    }

    return false;
} //AddFavorite

// Returns true if we need to check for a popup
function CheckForPopup(name) {
    var res = true;
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(name + "=");
        if (c_start != -1) {
            res = false;
        }
    }
    return res;

} //CheckForPopup

// Creates a cookie
function CreateCookie(name, value, days) {
    var exdate = new Date(); exdate.setDate(exdate.getDate() + days);
    document.cookie = name + "=" + escape(value) +
        ((days == null) ? "" : ";expires=" + exdate.toGMTString());
} //CreateCookie

$(document).ready(function () {
    $('#login_name').focus();

    if (!bCanAddFavorite) {
        $('#add-favorite').remove();
    }

    $('form').submit(function (ev) {
        var $password = $(this).find('input[name="password"]');

        var origVal = $password.val();
        $password.val(encodeURIComponent(origVal));

        setTimeout(function () {
            $password.val(origVal);
        }, 0);
    });

    if (bImpersonated && !$('.ERROR').text()) {
        window.close();
    }

    let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        document.body.setAttribute('data-theme', '1');
    }
});
