export const config = {
    api: {
        path: {
            login: '/login',
            user: {
                findAll: '/user',
                findById: '/user/:id',
                findByRole: '/user/role/:role',
            },
            calendarEvent: {
                findAll: '/calendar-event',
                findById: '/calendar-event/:id',
                findByDate: '/calendar-event/date',
                findByMember: '/calendar-event/member/:id',
                add: '/calendar-event/add',
                update: '/calendar-event/update',
                delete: '/calendar-event/delete',
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
