document.addEventListener("DOMContentLoaded", function (event) {
    //do work
    if (bots = new RegExp(["google-adwords", "google web preview", "google-structured-data", "appengine-google", "feedfetcher-google", "adsbot-google", "googlebot", "facebookexternalhit",
        "bingbot", "msnbot", "bingpreview", "pinterestbot", "google-read-aloud", "petalbot", "ahrefsbot", "adidxbot"].join("|"), "i"), !bots.test(navigator.userAgent)) {

        //not a bot!
        //check for cookie id
        if (getCookie('ckpi_cid') == "") {
            //create cookie and get id

            let url = "https://www.clickkpi.com/api/v1/click/getid";

            let params = new URLSearchParams(window.location.search.slice(1));

            let utm_source = params.get('utm_source');
            let utm_campaign = params.get('utm_campaign');
            let utm_content = params.get('utm_content');
            let utm_term = params.get('utm_term');
            let utm_medium = params.get('utm_medium');
            let adclickid = params.get('msclkid');
            if(adclickid == null){
                adclickid = params.get('gclid');
            }
            if(adclickid == null){
                adclickid = params.get('fbclid');
            }
            let uid = clickkpi_uid;
            let base_url = window.location.origin;

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url);

            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let jsonResponse = JSON.parse(xhr.responseText);
                    let a_tags = document.getElementsByTagName('a');
                    for (let i = 0; i < a_tags.length; i++) {
                        let oldUrl = a_tags[i].href; // Get current url

                        if (click_tag = new RegExp(["[clklrd]", "clickkpi"].join("|"), "i"), click_tag.test(oldUrl)) {
                            let newUrl = oldUrl.replace("[clklrd]", jsonResponse["clickid"]); // Create new url
                            newUrl = oldUrl.replace("clickkpi", jsonResponse["clickid"]);
                            a_tags[i].href = newUrl;
                            setCookie('ckpi_cid', jsonResponse["clickid"], 7);
                        }

                    }

                }
            };

            let data = JSON.stringify({
                "utm_source": utm_source,
                "utm_campaign": utm_campaign,
                "utm_content": utm_content,
                "utm_medium": utm_medium,
                "utm_term": utm_term,
                "uid": uid,
                "base_url": base_url,
                "adclickid": adclickid,
            });

            xhr.send(data);


        } else {
            let click_id = getCookie('ckpi_cid');
            let a_tags = document.getElementsByTagName('a');
            for (let i = 0; i < a_tags.length; i++) {
                let oldUrl = a_tags[i].href; // Get current url
                if (click_tag = new RegExp(["[clklrd]", "clickkpi"].join("|"), "i"), click_tag.test(oldUrl)) {
                    let newUrl = oldUrl.replace("[clklrd]", click_id); // Create new url
                    newUrl = oldUrl.replace("clickkpi", click_id);
                    a_tags[i].href = newUrl;

                }
            }
        }
    }


});
var sent_click = false;
document.addEventListener('click', e => {
        const origin = e.target.closest('a');
        let clicked = getCookie('ckpi_clicked');

        if ( clicked != '1') {

            if (sent_click === false) { //Put here the condition you want
                event.preventDefault(); // Here triggering stops
                if (origin) {

                    let url = "https://www.clickkpi.com/api/v1/click/clicked";
                    const linkurl = new URL(origin.href);
                    //need to update this to search for all parameters of affiliate networks
                    //check if url contains one of our affiliate parameters like tid, aff_id etc..

                    //search here for conversion params per affiliate company
                    if (click_tag = new RegExp(["tid", "aff_id"].join("|"), "i"), click_tag.test(linkurl)) {
                        let cb = linkurl.searchParams.get('tid');
                        let aff_id = linkurl.searchParams.get('aff_id');
                        tid =  ((cb == "")? aff_id : cb)
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
                                "tid": tid
                            });

                            xhr.send(data);
                        }
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
