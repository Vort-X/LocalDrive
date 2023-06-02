const same = (response) => response;
const json = (response) => response.json();
const blob = (response) => response.blob();

const appjson = (data) => JSON.stringify(data);
const appstream = (data) => data;

const sendRequest = ({path, method, headers, auth, type, format, data, successcb, failcb}) => {
    const access_token = window.sessionStorage.getItem('token');

    if (auth && headers) {
        headers['Authorization'] = 'Bearer ' + access_token;
    }

    fetch('https://localhost:7203/' + path, {
        method: method || 'GET',
        headers: headers || {},
        body: data && type(data),
    }).then(
        (response) => {
            if (!response.ok) {
                throw new Error();
            }
            return format(response);
        }
    ).then(successcb).catch(failcb);
}

// File Controller
// GET /download/{fileId}
export const sendDownloadFileRequest = (params, successcb, failcb) => {
    sendRequest({
        path: `download/${params.id}`,
        method: 'GET',
        headers: {},
        auth: true,
        type: appjson,
        format: blob,
        data: null,
        successcb: successcb,
        failcb: failcb,
    });
}

// GET /shared
export const sendGetFilesRequest = (params, successcb, failcb) => {
    sendRequest({
        path: 'shared',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: json,
        data: null,
        successcb: successcb,
        failcb: failcb,
    });
}

// POST /share
export const sendShareFileRequest = (data, successcb, failcb) => {
    sendRequest({
        path: 'share',
        method: 'POST',
        headers: {},
        auth: true,
        type: appstream,
        format: same,
        data: data,
        successcb: successcb,
        failcb: failcb,
    });
}

// POST /unshare
export const sendUnshareFileRequest = (data, successcb, failcb) => {
    sendRequest({
        path: 'unshare',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: same,
        data: data,
        successcb: successcb,
        failcb: failcb,
    });
}

// GET /shared/{profileId}
export const sendGetAccessesRequest = (params, successcb, failcb) => {
    sendRequest({
        path: `shared/${params.id}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: json,
        data: null,
        successcb: successcb,
        failcb: failcb,
    });
}

// POST /grant
export const sendGrantAccessRequest = (data, successcb, failcb) => {
    sendRequest({
        path: 'grant',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: same,
        data: data,
        successcb: successcb,
        failcb: failcb,
    });
}

// POST /revoke
export const sendRevokeAccessRequest = (data, successcb, failcb) => {
    sendRequest({
        path: 'revoke',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: same,
        data: data,
        successcb: successcb,
        failcb: failcb,
    });
}

// Profile Controller
// GET /all
export const sendGetProfilesRequest = (params, successcb, failcb) => {
    sendRequest({
        path: 'all',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: json,
        data: null,
        successcb: successcb,
        failcb: failcb,
    });
}

// POST /create
export const sendCreateProfileRequest = (data, successcb, failcb) => {
    sendRequest({
        path: 'create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: same,
        data: data,
        successcb: successcb,
        failcb: failcb,
    });
}

// POST /delete
export const sendDeleteProfileRequest = (data, successcb, failcb) => {
    sendRequest({
        path: 'delete',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: same,
        data: data,
        successcb: successcb,
        failcb: failcb,
    });
}

// POST /update
export const sendUpdateProfileRequest = (data, successcb, failcb) => {
    sendRequest({
        path: 'update',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: true,
        type: appjson,
        format: same,
        data: data,
        successcb: successcb,
        failcb: failcb,
    });
}

// POST /login
export const sendLoginRequest = (data, successcb, failcb) => {
    sendRequest({
        path: 'login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        auth: false,
        type: appjson,
        format: json,
        data: data,
        successcb: successcb,
        failcb: failcb,
    });
}
