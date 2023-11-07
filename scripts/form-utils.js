/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const errorList = {
    EMAIL_INVALID_ERROR: 'Invalid email address',
    EMAIL_UNKNOWN_ERROR: 'Email address not known',
};

/**
 * Really primitive validation (e.g a@a)
 * matches built-in validation in Firefox
 * @param {String} email
 * @returns {Boolean}
 */
function checkEmailValidity(email) {
    return /\S+@\S+/.test(email) && email.length <= 120;
}

/**
 * Hide all visible form error labels.
 * @param {HTMLFormElement} form
 */
function clearFormErrors(form) {
    const errorMsgs = form.querySelectorAll('.mzp-c-form-errors li');

    const errorContainer = form.querySelector(".mzp-c-form-errors");
    errorContainer.classList.add("hidden");
    errorContainer.style.display = "hidden";

    for (let i = 0; i < errorMsgs.length; i++) {
        errorMsgs[i].classList.add('hidden');
    }
}

/**
 * Add disabled property to all form fields.
 * @param {HTMLFormElement} form
 */
function disableFormFields(form) {
    const formFields = form.querySelectorAll('input, button, select, textarea');

    for (let i = 0; i < formFields.length; i++) {
        formFields[i].disabled = true;
    }
}

/**
 * Remove disabled property to all form fields.
 * @param {HTMLFormElement} form
 */
function enableFormFields(form) {
    const formFields = form.querySelectorAll('input, button, select, textarea');

    for (let i = 0; i < formFields.length; i++) {
        formFields[i].disabled = false;
    }
}

function postToEmailServer(action, params, successCallback, errorCallback) {
    const xhr = new XMLHttpRequest();

    // Emails used in automation for page-level integration tests
    // should avoid hitting basket directly.
    if (params.email === 'success@example.com') {
        successCallback();
        return;
    } else if (params.email === 'failure@example.com') {
        errorCallback();
        return;
    }

    xhr.onload = function (e) {
        let response = e.target.response || e.target.responseText;

        if (typeof response !== 'object') {
            response = JSON.parse(response);
        }

        if (response) {
            if (
                response.status === 'success' &&
                e.target.status >= 200 &&
                e.target.status < 300
            ) {
                successCallback();
            } else if (response.status === 'error') {
                errorCallback();
            } else {
                errorCallback();
            }
        } else {
            errorCallback();
        }
    };

    xhr.onerror = errorCallback;
    xhr.open('POST', action, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.timeout = 5000;
    xhr.ontimeout = errorCallback;
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(serialize(params));
}

function serialize(params) {
    const name = encodeURIComponent(params.name);
    const email = encodeURIComponent(params.email);
    const affiliation = encodeURIComponent(params.affiliation);
    const title = encodeURIComponent(params.title);

    return `name=${name}&email=${email}&affiliation=${affiliation}&title=${title}`
}


export {
    checkEmailValidity,
    clearFormErrors,
    errorList,
    disableFormFields,
    enableFormFields,
    postToEmailServer,
};
