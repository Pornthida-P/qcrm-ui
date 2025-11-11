import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: NavbarComponent,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../../pages/home-page/home-page.module').then((m) => m.HomePageModule),
                title: 'Home',
            },
            {
                path: 'contacts',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../../pages/contacts/contacts.module').then((m) => m.ContactsModule),
                        title: 'Contacts',
                    },
                    {
                        path: 'new',
                        loadChildren: () =>
                            import('../../pages/manage-contacts/manage-contacts.module').then((m) => m.ManageContactsModule),
                        title: 'New Contacts',
                    },
                    {
                        path: 'edit',
                        loadChildren: () =>
                            import('../../pages/manage-contacts/manage-contacts.module').then((m) => m.ManageContactsModule),
                        title: 'Edit Contacts',
                    },
                    {
                        path: 'phone',
                        loadChildren: () =>
                            import('../../pages/phone-contacts/phone-contacts.module').then((m) => m.PhoneContactsModule),
                        title: 'Phone Contacts',
                  },
                ],

            },
            {
                path: 'call',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../../pages/call/call.module').then((m) => m.CallModule),
                        title: 'Call',
                    },
                    {
                      path: 'create-call',
                      loadChildren: () => import('../../pages/create-call/create-call.module').then((m) => m.CreateCallModule),
                      title: 'Create Call',
                  },
                    {
                        path: 'edit',
                        loadChildren: () => import('../../pages/change-call/change-call.module').then((m) => m.ChangeCallModule),
                        title: 'Edit Call',
                    },
                ],
            },
            {
                path: 'report-page',
                loadChildren: () => import('../../pages/report-page/report-page.module').then((m) => m.ReportPageModule),
                title: 'Report',
            },
            {
                path: 'setting',
                loadChildren: () => import('../../pages/setting/setting.module').then((m) => m.SettingModule),
                title: 'Setting',
            },
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full',
            },
            {
                path: '**',
                redirectTo: 'error/404',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NavbarRoutingModule {}
