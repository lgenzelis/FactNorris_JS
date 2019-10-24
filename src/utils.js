import toaster from "toasted-notes";
import React from "react";

export function showErrorPopup(errorMsg) {
    const errorMsgRendered =
        <div className="popup">
            <p>
                <strong>An error has occurred :(</strong>
            </p>
            <p>
                {errorMsg}
            </p>
        </div>;
    toaster.notify(errorMsgRendered, {
        duration: null, // i.e., don't auto-dismiss
        position: "bottom",
    });
}


export class localStorageManager {
    static errorMsg = 'Your browser does not allow access to local storage.';

    static loadFromLocalStorage(key) {
        try {
            return localStorage[key];
        }
        catch {
            showErrorPopup(this.errorMsg);
            return undefined;
        }
    }

    static saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        }
        catch {
            showErrorPopup(this.errorMsg);
            return false;
        }
    }
}

