import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: NavbarComponent,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../../pages/home/home.module').then((m) => m.HomeModule),
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
                path: 'survey/form',
                children: [
                    {
                      path: '',
                      loadChildren: () => import('../../pages/survey-form/survey-form.module').then((m) => m.SurveyFormModule),
                      title: 'Survey Form',
                    },
                    {
                      path: 'new',
                      loadChildren: () => import('../../pages/manage-survey-form/manage-survey-form.module').then((m) => m.ManageSurveyFormModule),
                      title: 'New Survey Form',
                    },
                  ]
            },
            {
                path: 'call',
                loadChildren: () => import('../../pages/call/call.module').then((m) => m.CallModule),
                title: 'Call',
            },
            {
                path: 'e-learning',
                loadChildren: () => import('../../pages/e-learning/e-learning.module').then((m) => m.ELearningModule),
                title: 'E-Learning',
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
