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
                title: 'Home',
            },
            {
                path: 'survey',
                loadChildren: () => import('../../pages/survey/survey.module').then((m) => m.SurveyModule),
                title: 'Home',
            },
            {
                path: 'survey/form',
                loadChildren: () => import('../../pages/survey-form/survey-form.module').then((m) => m.SurveyFormModule),
                title: 'Home',
            },
            {
                path: 'call',
                loadChildren: () => import('../../pages/call/call.module').then((m) => m.CallModule),
                title: 'Home',
            },
            {
                path: 'e-learning',
                loadChildren: () => import('../../pages/e-learning/e-learning.module').then((m) => m.ELearningModule),
                title: 'Home',
            },
            {
                path: 'training',
                loadChildren: () => import('../../pages/training/training.module').then((m) => m.TrainingModule),
                title: 'Home',
            },
            {
                path: 'products',
                loadChildren: () => import('../../pages/products/products.module').then((m) => m.ProductsModule),
                title: 'Home',
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
