//const AllowedReferrer = 'skk.moe';

addEventListener('fetch', (event) => {
    event.respondWith(response(event));
});

async function senData(event, url, uuid, user_agent, page_url) {
    const encode = (data) => encodeURIComponent(decodeURIComponent(data));

    const getReqHeader = (key) => event.request.headers.get(key);
    const getQueryString = (name) => {
        let pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = url.search.substr(1).match(pattern);
        return (r !== null) ? unescape(r[2]) : null;
    };

    let reqParameter = {
        headers: {
            'Host': 'www.google-analytics.com',
            'User-Agent': user_agent,
            'Accept': getReqHeader('Accept'),
            'Accept-Language': getReqHeader('Accept-Language'),
            'Accept-Encoding': getReqHeader('Accept-Encoding'),
            'Cache-Control': 'max-age=0'
        }
    };

    const pvData = `tid=${encode(getQueryString('ga'))}&cid=${uuid}&dl=${encode(page_url)}&uip=${getReqHeader('CF-Connecting-IP')}&ua=${user_agent}&dt=${encode(getQueryString('dt'))}&de=${encode(getQueryString('de'))}&dr=${encode(getQueryString('dr'))}&ul=${getQueryString('ul')}&sd=${getQueryString('sd')}&sr=${getQueryString('sr')}&vp=${getQueryString('vp')}`;

    const perfData = `plt=${getQueryString('plt')}&dns=${getQueryString('dns')}&pdt=${getQueryString('pdt')}&rrt=${getQueryString('rrt')}&tcp=${getQueryString('tcp')}&srt=${getQueryString('srt')}&dit=${getQueryString('dit')}&clt=${getQueryString('clt')}`

    const pvUrl = `https://www.google-analytics.com/collect?v=1&t=pageview&${pvData}&z=${getQueryString('z')}`;
    const perfUrl = `https://www.google-analytics.com/collect?v=1&t=timing&${pvData}&${perfData}&z=${getQueryString('z')}`

    await fetch(pvUrl, reqParameter);
    await fetch(perfUrl, reqParameter);
}

async function response(event) {
    const url = new URL(event.request.url);

    const getReqHeader = (key) => event.request.headers.get(key);

    const Referer = getReqHeader('Referer');
    const user_agent = getReqHeader('User-Agent');

    let needBlock = false;
    (!Referer || !user_agent || !url.search.includes('ga=UA-')) ? needBlock = true : needBlock = false;

    if (typeof AllowedReferrer !== 'undefined' && AllowedReferrer !== null && AllowedReferrer && Referer) {
        (!Referer.includes(AllowedReferrer)) ? needBlock = true : needBlock = false;
    }

    // Block Request that have no referer, no user-agent and no ga query.
    if (needBlock) {
        return new Response('403 Forbidden', {
            headers: { 'Content-Type': 'text/html' },
            status: 403,
            statusText: 'Forbidden'
        });
    } else {
        const getCookie = (name) => {
            let pattern = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
            let r = (getReqHeader('cookie') || '').match(pattern);
            return (r !== null) ? unescape(r[2]) : null;
        };

        const createUuid = () => {
            let s = [];
            const hexDigits = '0123456789abcdef';
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = '-';

            return s.join('');
        };

        const _uuid = getCookie('uuid');
        const uuid = (_uuid) ? _uuid : createUuid();

        // To sent data to google analytics after response id finished
        event.waitUntil(senData(event, url, uuid, user_agent, Referer));

        // Return an 204 to speed up: No need to download a gif
        let response = new Response(null, {
            status: 204,
            statusText: 'No Content'
        });

        if (!_uuid) response.headers.set('Set-Cookie', `uuid=${uuid}; Expires=${new Date((new Date().getTime() + 365 * 86400 * 30 * 1000)).toGMTString()}; Path='/';`);

        return response
    }
}
