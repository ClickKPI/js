document.addEventListener("DOMContentLoaded", function (event) {
        //do work
        if (bots = new RegExp(["google-adwords", "google web preview", "google-structured-data", "appengine-google", "feedfetcher-google", "adsbot-google", "googlebot", "facebookexternalhit",
            "bingbot", "msnbot", "bingpreview", "pinterestbot", "google-read-aloud", "petalbot", "ahrefsbot", "adidxbot"].join("|"), "i"), !bots.test(navigator.userAgent)) {

            //not a bot!
            //check for cookie id
            if (getCookie('ckpi_cid') == "") {
                //create cookie and get id

                let url = "https://www.clickkpi.com/api/v1/click/getid";

                var params = new URLSearchParams(window.location.search.slice(1));

                var utm_source = params.get('utm_source');
                var utm_campaign = params.get('utm_campaign');
                var utm_content = params.get('utm_content');
                var utm_term = params.get('utm_term');
                var utm_medium = params.get('utm_medium');
                var adclickid = params.get('msclkid');
                var uid = clickkpi_uid;
                var camp_uid = clickkpi_campaign_uid;

                var xhr = new XMLHttpRequest();
                xhr.open("POST", url);

                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var a_tags = document.getElementsByTagName('a');
                        for (var i = 0; i < a_tags.length; i++) {
                            var oldUrl = a_tags[i].href; // Get current url

                            var newUrl = oldUrl.replace("[clklrd]", jsonResponse["clickid"]); // Create new url

                            a_tags[i].href = newUrl;
                            setCookie('ckpi_cid', jsonResponse["clickid"], 7);
                        }

                    }
                };

                var data = JSON.stringify({
                    "utmsource": utm_source,
                    "utmcampaign": utm_campaign,
                    "utmcontent": utm_content,
                    "utmmedium": utm_medium,
                    "utmterm": utm_term,
                    "uid": uid,
                    "camp_uid": camp_uid,
                    "adclickid": adclickid,
                });

                xhr.send(data);


            } else {
                var click_id = getCookie('ckpi_cid');
                var a_tags = document.getElementsByTagName('a');
                for (var i = 0; i < a_tags.length; i++) {
                    var oldUrl = a_tags[i].href; // Get current url

                    var newUrl = oldUrl.replace("[clklrd]", click_id); // Create new url

                    a_tags[i].href = newUrl;
                }
            }
        }


    });
    var sent_click = false;
    document.addEventListener('click', e => {
            const origin = e.target.closest('a');
            var clicked = getCookie('ckpi_clicked');

            if ( clicked != '1') {

                if (sent_click === false) { //Put here the condition you want
                    event.preventDefault(); // Here triggering stops
                    if (origin) {

                        let url = "https://www.clickkpi.com/api/v1/click/clicked";
                        const linkurl = new URL(origin.href);

                        var tid = linkurl.searchParams.get('tid');
                        if (tid != "") {
                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", url);

                            xhr.setRequestHeader("Content-Type", "application/json");
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4 && xhr.status === 200) {
                                    setCookie('ckpi_clicked', '1', 7);
                                    location.assign(origin.href);
                                }
                            };

                            var data = JSON.stringify({
                                "tid": tid,
                                    "url": linkurl
                            });

                            xhr.send(data);
                        }

                    }

                }

            }
        }
        ,
        false
    );


    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires;
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
