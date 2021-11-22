let url = '';
let tkn = '';
let tknp = '';
let stage = false;

if (process.env.NODE_ENV === 'development') {
    url = '//server.docker/';
    tkn = '';
    tknp = `?authtoken=${tkn}`;
} else if (typeof SERVER_URL !== 'undefined') {
    // Dieser Wert stammt aus der page-app.php
    // eslint-disable-next-line no-undef
    url = SERVER_URL;
} else {
    url = '//enummer2.marburg.lan/'; // LIVE Fallback Url
}

if (typeof SERVER_STAGE !== 'undefined') {
    // Dieser Wert stammt aus der page-app.php
    // eslint-disable-next-line no-undef
    stage = SERVER_STAGE;
}
export const IS_STAGE = stage;

export const BASE_API = url;
export const AJAX_CONTENT_TYPE_XFORM = 'application/x-www-form-urlencoded; charset=UTF-8';
export const AJAX_CONTENT_TYPE_JSON = 'application/json; charset=UTF-8';

export const WEBSERVER_HOST = `${url}`;
export const WEBSERVER_METHOD_POST = 'POST';
export const WEBSERVER_METHOD_GET = 'GET';
export const WEBSERVER_RETURN_TYPE = 'json';
export const WEBSERVER_TIMEOUT = 20000;
export const AJAX_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';
