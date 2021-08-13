(function (window, document, navigator) {
    var screen = window.screen,
        encode = encodeURIComponent,
        max = Math.max,
        //min = Math.min,
        performance = window.performance,
        t = performance && performance.timing,
        filterNumber = function (num) { return isNaN(num) || num == Infinity || num < 0 ? void 0 : num; },
        randomStr = function (num) { return Math.random().toString(36).slice(-num); },
        randomNum = function (num) { return Math.ceil(Math.random() * (num - 1)) + 1; },
        fallback = function (id) {
            // Original Google Analytics `analytics.js` Code
            (function (window, document, tag, src, name) {
                window['GoogleAnalyticsObject'] = name;
                window[name] = window[name] || function () {
                    (window[name].q = window[name].q || []).push(arguments);
                };
                window[name].l = 1 * new Date();
                var element = document.createElement(tag);
                first_element = document.getElementsByTagName(tag)[0];
                element.async = true;
                element.src = src;
                first_element.parentNode.insertBefore(element, first_element);
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            ga('create', id, 'auto');
            ga('send', 'pageview');
        };

    // sendGA: collect data and send.
    function sendGA() {
        var pv_data = [
            // Random String against Easy Privacy
            randomStr(randomNum(4)) + '=' + randomStr(randomNum(6)),
            // GA tid
            'ga=' + window.ga_tid,
            // Title
            'dt=' + encode(document.title),
            // Document Encoding
            'de=' + encode(document.characterSet || document.charset),
            // Referrer
            'dr=' + encode(document.referrer),
            // Language
            'ul=' + (navigator.language || navigator.browserLanguage || navigator.userLanguage),
            // Color Depth
            'sd=' + screen.colorDepth + '-bit',
            // Screen Size
            'sr=' + screen.width + 'x' + screen.height,
            // Display
            'vp=' + max(document.documentElement.clientWidth, window.innerWidth || 0) + 'x' + max(document.documentElement.clientHeight, window.innerHeight || 0),
            // plt: Page Loading Time
            // open the page => window.onload
            // (window.onload)
            'plt=' + filterNumber(t.loadEventStart - t.navigationStart || 0),
            // dns: DNS Time
            'dns=' + filterNumber(t.domainLookupEnd - t.domainLookupStart || 0),
            // pdt: Page Dowenload Time
            // start download time => finish download time
            'pdt=' + filterNumber(t.responseEnd - t.responseStart || 0),
            // rrt: Redirect Time
            'rrt=' + filterNumber(t.redirectEnd - t.redirectStart || 0),
            // tcp: TCP Time
            'tcp=' + filterNumber(t.connectEnd - t.connectStart || 0),
            // srt: Server Response Time
            // start request => server send first byte
            // (TTFB - TCP - DNS)
            'srt=' + filterNumber(t.responseStart - t.requestStart || 0),
            // dit: DOM Interactive Time
            'dit=' + filterNumber(t.domInteractive - t.domLoading || 0),
            // clt: Content Loading Time
            // open the page => DOMContentLoaded
            'clt=' + filterNumber(t.domContentLoadedEventStart - t.navigationStart || 0),
            'z=' + Date.now()
        ];

        window.__ga_img = new Image();
        const __ga_img_timeout = setTimeout(function () {
            window.__ga_img.onerror = window.__ga_img.onload = null;
            // Use original google analytics code if timeout
            fallback(window.ga_tid);
        }, 3000);
        window.__ga_img.onerror = function () {
            clearTimeout(__ga_img_timeout);
            // Use original google analytics code if catched an error
            fetch(window.__ga_img.src, { mode: 'cors' })
                .catch(() => {
                    fallback(window.ga_tid);
                });
        };
        window.__ga_img.onload = function () {
            // Remove fallback
            clearTimeout(__ga_img_timeout);
        };
        window.__ga_img.src = window.ga_api + '?' + pv_data.join('&');
    }

    window.cfga = sendGA;

    if (document.readyState === 'complete') {
        sendGA();
    } else {
        window.addEventListener('load', sendGA);
    }
})(window, document, navigator);
