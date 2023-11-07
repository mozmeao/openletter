/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {
    checkEmailValidity,
    clearFormErrors,
    errorList,
    disableFormFields,
    enableFormFields,
    postToEmailServer
} from './form-utils';

import "@mozilla-protocol/core/protocol/js/protocol-newsletter.min.js";

let form;

const EmailForm = {
  handleFormError: (msg) => {
    let error;

    enableFormFields(form);

    switch (msg) {
      case errorList.EMAIL_INVALID_ERROR:
        error = form.querySelector(".error-email-invalid");
        break;
      default:
        error = form.querySelector(".error-try-again-later");
    }

    if (error) {
        const errorContainer = form.querySelector(".mzp-c-form-errors");
        errorContainer.classList.remove("hidden");
        errorContainer.style.display = "block";
        error.classList.remove("hidden");
    }
  },

  handleFormSuccess: () => {
      form.classList.add("hidden");
      const thanks = document.getElementById("signature-thanks");
      thanks.style.display = "block";
  },

  validateFields: () => {
    const email = form.querySelector('input[id="email"]').value;

    // Really basic client side email validity check.
    if (!checkEmailValidity(email)) {
      EmailForm.handleFormError(errorList.EMAIL_INVALID_ERROR);
      return false;
    }

    return true;
  },

  submit: (e) => {
    const action = form.getAttribute('action');
    const name = form.querySelector('input[id="name"]').value;
    const email = form.querySelector('input[id="email"]').value;
    const affiliation = form.querySelector('input[id="affiliation"]').value;
    const title = form.querySelector('input[id="title"]').value;

    e.preventDefault();
    e.stopPropagation();

    // Disable form fields until POST has completed.
    disableFormFields(form);

    // Clear any prior messages that might have been displayed.
    clearFormErrors(form);

    // Perform client side form field validation.
    if (!EmailForm.validateFields()) {
      return;
    }

    const params = {
      name,
      email,
      affiliation,
      title,
    };

    postToEmailServer(action, params, EmailForm.handleFormSuccess, EmailForm.handleFormError);
  },

  init: () => {
    form = document.getElementById("signature-form");

    if (!form) {
      return;
    }

    form.addEventListener("submit", EmailForm.submit, false);
  },
};

EmailForm.init();
