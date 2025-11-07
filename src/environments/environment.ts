export const environment = {
    production: true,
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
    },
    subPath: '/qcrm',
    socket: {
        url: 'http://localhost:3000',
        path: '/socket.io',
    },
};
