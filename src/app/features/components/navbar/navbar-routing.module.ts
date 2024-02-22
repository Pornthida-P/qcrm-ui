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
                loadChildren: () => import('../../pages/contacts/contacts.module').then((m) => m.ContactsModule),
                title: 'Contacts',
            },
            {
                path: 'survey',
                loadChildren: () => import('../../pages/survey/survey.module').then((m) => m.SurveyModule),
                title: 'Survey',
            },
            {
                path: 'surveyform',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../../pages/survey-form/survey-form.module').then((m) => m.SurveyFormModule),
                        title: 'Survey Form',
                    },
                    {
                        path: 'new',
                        loadChildren: () =>
                            import('../../pages/manage-survey-form/manage-survey-form.module').then((m) => m.ManageSurveyFormModule),
                        title: 'New Survey Form',
                    },
                    {
                        path: 'edit',
                        loadChildren: () =>
                            import('../../pages/manage-survey-form/manage-survey-form.module').then((m) => m.ManageSurveyFormModule),
                        title: 'Edit Survey Form',
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
                        path: 'create',
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
                path: 'e-learning',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../../pages/e-learning/e-learning.module').then((m) => m.ELearningModule),
                        title: 'E-Learning',
                    },
                    {
                        path: 'edit',
                        loadChildren: () => import('../../pages/e-learning-edit/e-learning-edit.module').then((m) => m.ELearningEditModule),
                        title: 'E-Learning Edit',
                    },
                ],
            },
            {
                path: 'training',
                loadChildren: () => import('../../pages/training/training.module').then((m) => m.TrainingModule),
                title: 'Training',
            },
            {
                path: 'products',
                loadChildren: () => import('../../pages/products/products.module').then((m) => m.ProductsModule),
                title: 'Products',
            },
            {
                path: 'announcement-page',
                loadChildren: () => import('../../pages/announcement-page/announcement-page.module').then((m) => m.AnnouncementPageModule),
                title: 'Announcement',
            },
            {
                path: 'setting',
                loadChildren: () => import('../../pages/setting/setting.module').then((m) => m.SettingModule),
                title: 'Products',
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
