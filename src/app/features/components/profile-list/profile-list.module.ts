import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileModule } from '../profile/profile.module';
import { ProfileListComponent } from './profile-list.component';

@NgModule({
    declarations: [ProfileListComponent],
    imports: [CommonModule, ProfileModule],
    exports: [ProfileListComponent],
})
export class ProfileListModule {}
