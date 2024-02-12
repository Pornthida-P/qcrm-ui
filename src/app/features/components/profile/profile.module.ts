import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [ProfileComponent],
    imports: [CommonModule, FontAwesomeModule],
    exports: [ProfileComponent],
})
export class ProfileModule {}
