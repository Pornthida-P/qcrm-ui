export const environment = {
    production: true,
    api: {
        url: 'https://devel02.convtech.dev/roddonjai-qcrm-apis',
        endpoint: {
            contact: {
                findAll: '/contact/all',
                findById: '/contact/id',
                findByPage: '/contact/pages',
                countAllItem: '/contact/countAllItem',
            },
        },
    },
    subPath: '/roddonjai-qcrm',
    socket: {
        url: 'https://devel02.convtech.dev',
        path: '/roddonjai-qcrm-apis/socket.io',
    },
};
