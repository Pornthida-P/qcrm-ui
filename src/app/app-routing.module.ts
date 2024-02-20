import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/components/navbar/navbar.module').then((m) => m.NavbarModule),
    },
    {
        path: 'survey',
        loadChildren: () => import('./features/pages/survey/survey.module').then((m) => m.SurveyModule),
        title: 'Survey',
    },
    {
        path: 'login',
        loadChildren: () => import('./features/pages/login/login.module').then((m) => m.LoginModule),
        title: 'Login',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
