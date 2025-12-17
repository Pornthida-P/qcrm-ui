export const config = {
    api: {
        path: {
            login: '/login',
            logout: '/logout',
            attachment: {
                upload: '/attachment/upload',
                delete: '/attachment/delete/',
            },
            user: {
                findAll: '/user',
                findById: '/user/id/',
                findAllRoles: '/user/roles',
                add: '/user/add',
                update: '/user/update',
                updatePassword: '/user/update-password',
                uploadProfileImage: '/user/upload-profile-image',
                deleteUser: '/user/delete',
            },
            contacts: {
                baseUrl: '/contact',
                find: '/find',
                count: '/count',
                countByAssignedUserId: '/count-by-assigned-user-id',
                paramsFide: '/params-fide',
                call: '/call',
                contactNumberIdByPhone: '/contact-number-id',
            },
            call: {
                url: '/call',
                uploadFile: '/upload',
            },
            report: {
                baseUrl: '/report',
                list: '/list',
            },
            callList: {
                baseUrl: '/case',
                all: '/all',
                status: '/status',
                caseTopics: '/topics',
                caseSubjects: '/subjects',
                channels: '/channels',
                agent: '/agent',
                comment: '/comments',
                caseTopicId: '/topic-id',
                callStatus: '/call-status',
                callStatusId: '/call-status-id',
                history: '/history',
            },
            chatHistory: '/chathistory/getchat',
        },
    },
    strapi: {
        url: 'https://devel.convtech .dev/qcrm-strapi/api',
        // url: 'http://localhost:1337/api',
        path: {
            auditlog: '/auditlogs',
        },
        key: '60ee667509833c204e120371481686a2d5b43035c480750ce1641defc8ca6a0c84f00845634048bc13bed34caf6a10ca5d1399e7e2ae4ad5a8e7b864b447f50156cf0bb0670208ca3073a53f2917a4380b0465ef3190d8822ad66250189cf82357cff832626335cd6de1b5758f2d59625fbbbc0e6f5c1f7f92f4aad6c0b10b66',
    },
    file: {
        maxSize: 2 * 1024 * 1024,
        type: '.xlsx',
    },
    roleCanAccessCUDForm: ['admin', 'system', 'super admin'],
    urlWebSocket: {
        urlQAgent: `ws://127.0.0.1:8748/QAgent`,
        dialPrefix: 'dial|7',
    },
    operationType: {
        inbound: 'Inbound',
        outbound: 'Outbound',
    },
};
