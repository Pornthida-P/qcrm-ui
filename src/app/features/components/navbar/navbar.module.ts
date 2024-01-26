import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarRoutingModule } from './navbar-routing.module';
import { NavbarComponent } from './navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [NavbarComponent],
    imports: [CommonModule, NavbarRoutingModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, NgbPopoverModule],
})
export class NavbarModule {}
