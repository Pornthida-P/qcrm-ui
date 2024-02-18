import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarRoutingModule } from './navbar-routing.module';
import { NavbarComponent } from './navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from '../sidebar/sidebar.component';

@NgModule({
    declarations: [NavbarComponent, SidebarComponent],
    imports: [CommonModule, NavbarRoutingModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, NgbPopoverModule, NgbModule],
})
export class NavbarModule {}
