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
                channelByAgent: '/report/channelByAgent',
                caseTypeByAgent: '/report/caseTypeByAgent',
                summaryByMonth: '/report/summaryByMonth',
                caseDetail: '/report/caseDetail',
                getAgent: '/report/getAgent',
            },
            callList: {
                baseUrl: '/case',
                all: '/all',
                status: '/status',
                caseTopics: '/topics',
                caseSubjects: '/subjects',
                channels: '/channels',
                agent: '/agent',
            },
        },
    },
    strapi: {
        url: 'https://devel.convtech.dev/qcrm-strapi/api',
        path: {
            auditlog: '/auditlogs',
        },
        key: '8c8cb1eb42112e450ac048f4e70878e4becdfc27544d14a8b65c942b9a9fab9333596d26aeedeeb1b65322ffe5e380eee7fe8d1b61c91d0f2427b972015f744c35ebd634f4d28cdd750dd2fd37088173eb7cf85d615ff6dacaa1eec1dfa87b751590302093fed23336e67691e8afb78032e9cf19b4e169a04faeb481b8d612a7',
    },
    file: {
        maxSize: 2 * 1024 * 1024,
        type: '.xlsx',
    },
    roleCanAccessCUDForm: ['admin', 'system', 'super admin'],
    urlWebSocket: {
        urlQAgent: `ws://127.0.0.1:8748/QAgent`,
    },
};
