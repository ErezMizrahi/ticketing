interface FetchAttr {
    route: string,
    method?: "get" | "post",
    headersMap?: any,
    body?: any
}

export default ({route, method = "get", headersMap, body}: FetchAttr) => {
    if(typeof window === 'undefined') {
        //server
        const { headers } = require('next/headers');
        const headersList = headers();
        const serverUrl = `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local${route}`;
        const serverHeaders = {
            ...headersMap,
            Host: headersList.get('host'),
            Cookie: headersList.get('cookie')
        };

        console.log('from back end... ', serverUrl)
        return fetch(serverUrl, { method, headers: serverHeaders, body: JSON.stringify(body) });
    } else {
        //client
        console.log('from front end... ', route)
        return fetch(route, { method, headers: headersMap, body: JSON.stringify(body) });
    }
}