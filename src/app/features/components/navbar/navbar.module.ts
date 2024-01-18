import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarRoutingModule } from './navbar-routing.module';
import { NavbarComponent } from './navbar.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
    declarations: [NavbarComponent],
    imports: [
        CommonModule,
        NavbarRoutingModule,
        TieredMenuModule,
        FontAwesomeModule,
        SidebarModule,
        ButtonModule,
        AvatarModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        MenuModule,
        OverlayPanelModule,
    ],
})
export class NavbarModule {}
