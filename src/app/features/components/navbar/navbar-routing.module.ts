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
