//const AllowedReferrer = 'skk.moe';

const createUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0,
            v = (c == 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
const encode = (data) => encodeURIComponent(decodeURIComponent(data));

addEventListener('fetch', (event) => {
    event.respondWith(response(event));
});

async function senData(pvUrl, perfUrl, reqParameter) {
    await fetch(pvUrl, reqParameter);
    await fetch(perfUrl, reqParameter);
}

async function response(event) {
    const url = new URL(event.request.url);

    const getReqHeader = (key) => event.request.headers.get(key);
    const getQueryString = (name) => {
        let pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = url.search.substr(1).match(pattern);
        return (r !== null) ? unescape(r[2]) : null;
    };
    const getCookie = (name) => {
        let pattern = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        let r = (getReqHeader('cookie') || '').match(pattern);
        return (r !== null) ? unescape(r[2]) : null;
    };

    const hasUuid = getCookie('uuid');
    const uuid = (hasUuid) ? getCookie('uuid') : createUuid();

    let response;

    let needBlock = false;
    (!getReqHeader('Referer') || !getReqHeader('User-Agent') || !getQueryString('ga')) ? needBlock = true : needBlock = false;

    if (typeof AllowedReferrer !== 'undefined' && AllowedReferrer !== null) {
        if (AllowedReferrer && getReqHeader('Referer')) {
            (!(getReqHeader('Referer').indexOf(AllowedReferrer) > -1)) ? needBlock = true : needBlock = false;
        }
    }


    // Block Request that have no referer, no user-agent and no ga query.
    if (needBlock) {
        response = new Response('<html>403 Forbidden</html>', {
            headers: { 'Content-Type': 'text/html' },
            status: 403,
            statusText: 'Forbidden'
        });

        return response;
    } else {
        const pvData = [
            // UA-XXXXXX-Y
            'tid=' + encode(getQueryString('ga')),
            // UUID Version 4
            'cid=' + uuid,
            // Document URL
            'dl=' + encode(getReqHeader('Referer')),
            // Real IP - Collect from CF-Connecting-IP
            'uip=' + getReqHeader('CF-Connecting-IP'),
            // Title
            'dt=' + encode(getQueryString('dt')),
            // Document Encoding
            'de=' + encode(getQueryString('de')),
            // Referrer
            'dr=' + encode(getQueryString('dr')),
            // Language
            'ul=' + encode(getQueryString('ul')),
            // Color Depth
            'sd=' + encode(getQueryString('sd')),
            // Screen Size
            'sr=' + encode(getQueryString('sr')),
            // Display
            'vp=' + encode(getQueryString('vp')),
            'z=' + getQueryString('z')
        ];

        const perfData = [
            // plt: Page Loading Time
            'plt=' + getQueryString('plt'),
            // dns: DNS Time
            'dns=' + getQueryString('dns'),
            // pdt: Page Dowenload Time
            // start download time => finish download time
            'pdt=' + getQueryString('pdt'),
            // rrt: Redirect Time
            'rrt=' + getQueryString('rrt'),
            // tcp: TCP Time
            'tcp=' + getQueryString('tcp'),
            // srt: Server Response Time
            // start request => server send first byte
            // (TTFB - TCP - DNS)
            'srt=' + getQueryString('srt'),
            // dit: DOM Interactive Time
            'dit=' + getQueryString('dit'),
            // clt: Content Loading Time
            // open the page => DOMContentLoaded
            'clt=' + getQueryString('clt')
        ];

        const pvUrl = `https://www.google-analytics.com/collect?v=1&t=pageview&${pvData.join('&')}`;
        const perfUrl = `https://www.google-analytics.com/collect?v=1&t=timing&${pvData.concat(perfData).join('&')}`

        let parameter = {
            headers: {
                'Host': 'www.google-analytics.com',
                'User-Agent': getReqHeader('User-Agent'),
                'Accept': getReqHeader('Accept'),
                'Accept-Language': getReqHeader('Accept-Language'),
                'Accept-Encoding': getReqHeader('Accept-Encoding'),
                'Cache-Control': 'max-age=0'
            }
        };

        if (event.request.headers.has('Referer')) {
            parameter.headers.Referer = getReqHeader('Referer');
        }
        if (event.request.headers.has('Origin')) {
            parameter.headers.Origin = getReqHeader('Origin');
        }

        // Return an 204 to speed up: No need to download a gif
        response = new Response(null, {
            status: 204,
            statusText: 'No Content'
        });

        if (!hasUuid) {
            const cookieContent = `uuid=${uuid}; Expires=${new Date((new Date().getTime() + 365 * 86400 * 30 * 1000)).toGMTString()}; Path='/';`;
            response.headers.set('Set-Cookie', cookieContent)
        }

        // To sent data to google analytics after response id finished
        event.waitUntil(senData(pvUrl, perfUrl, parameter));

        return response
    }
}
