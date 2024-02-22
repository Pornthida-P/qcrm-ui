import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ProfileComponent],
    imports: [CommonModule, FontAwesomeModule, NgbModule],
    exports: [ProfileComponent],
})
export class ProfileModule {}
