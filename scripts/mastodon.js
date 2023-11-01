/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

(function () {
    'use strict';

    var button = document.querySelector('.js-mastodon-share');
    var share_url = button.getAttribute('data-share-url');
    var share_text = button.getAttribute('data-share-text');

    function init() {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            var domain = prompt("Enter your Mastodon domain", "mastodon.social");

            if (domain == "" || domain == null){
                return;
            }

            // Build the URL
            var url = "https://" + domain + "/share?text=" + share_text + share_url;

            // Open a window on the share page
            window.open(url, '_blank');
        });
    }

    if (button !== null) {
        init();
    }
})();
