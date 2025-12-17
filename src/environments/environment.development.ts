export const environment = {
    production: false,
    api: {
        url: 'http://localhost:3000',
        endpoint: {
            contact: {
                findAll: '/contact/all',
                findById: '/contact/id',
                findByPage: '/contact/pages',
                countAllItem: '/contact/countAllItem',
            },
        },
        urlQIM: 'https://devel.convtech.dev/roddonjai/server',
    },
    subPath: '',
    socket: {
        url: 'http://localhost:3000',
        path: '/socket.io',
    },
    strapi: {
        url: 'https://devel02.convtech.dev/roddonjai-qcrm-strapi/api',
        // url: 'http://localhost:1337/api',
        path: {
            auditlog: '/auditlogs',
        },
        key: 'e7575d7d74afb4f066e2650069d0f2265f6863fe26b9fde47958d5133e2684f0e6e78c327ca66bd2769aad3d05c085b8c24171fe3d29fab8d5a23f0603dc751ac50f46fd4be9322760a4ee6e67909a0ff33835424a8cbac54a4e94c631b8db534572ba23480eeb9e2ae04d982800d1de527dd97ba050547fc5d7a264ce3444fc',
    },
    urlWebSocket: {
        urlQAgent: `ws://127.0.0.1:8748/QAgent`,
        dialPrefix: 'dial|9',
    },
};
