import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: SettingComponent,
        children: [
            {
                path: 'menagement-account',
                loadChildren: () =>
                    import('../../components/menagement-account/menagement-account.module').then((m) => m.MenagementAccountModule),
                title: 'Menagement Account',
            },

            {
                path: 'menagement-password',
                loadChildren: () =>
                    import('../../components/menagement-password/menagement-password.module').then((m) => m.MenagementPasswordModule),
                title: 'Menagement Password',
            },
            {
                path: '',
                redirectTo: 'menagement-account',
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
export class SettingRoutingModule {}
