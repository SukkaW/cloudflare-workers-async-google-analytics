(function (window, document, navigator) {
    var screen = window.screen,
        encode = encodeURIComponent,
        max = Math.max,
        //min = Math.min,
        performance = window.performance,
        t = performance && performance.timing,
        filterNumber = function (num) { return isNaN(num) || num == Infinity || num < 0 ? void 0 : num; };

    // sendGA: collect data and send.
    function sendGA() {
        var pv_data = [
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
        window.__ga_img.src = window.ga_api + '?' + pv_data.join('&');
    }

    if (document.readyState === 'complete') {
        sendGA();
    } else {
        window.addEventListener('load', sendGA);
    }
})(window, document, navigator);