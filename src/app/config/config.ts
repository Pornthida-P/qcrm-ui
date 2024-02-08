export const config = {
    api: {
        path: {
            login: '/login',
            attachment: {
                find: '/attachment/find',
                upload: '/attachment/upload',
                download: '/attachment/download',
                delete: '/attachment/delete/',
            },
            user: {
                findAll: '/user',
                findById: '/user/:id',
                findByRole: '/user/role/:role',
            },
            announcement: {
                findAll: '/announcement',
                findById: '/announcement/id/',
                findByDate: '/announcement/date/',
                add: '/announcement/add',
                update: '/announcement/update',
                delete: '/announcement/delete/',
            },
            calendarEvent: {
                findAll: '/calendar-event',
                findById: '/calendar-event/id/',
                findByDate: '/calendar-event/date',
                findByMember: '/calendar-event/member/id/',
                add: '/calendar-event/add',
                update: '/calendar-event/update',
                delete: '/calendar-event/delete',
                findAlltags: '/calendar-event/tags',
            },
            elearning: '/e-learning',
            surveyForm: {
                baseUrl: '/survey-form',
                find: '/find',
                count: '/count',
            },
            call: {
                url: '/call',
                count: '/count',
            },
        },
    },
    file: {
        type: '.xlsx',
    },
    roleCanAccessCUDForm: ['admin', 'system', 'super admin'],
};
