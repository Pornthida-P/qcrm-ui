import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { UserMenagementModule } from '../../modals/user-menagement/user-menagement.module';

@NgModule({
    declarations: [ProfileComponent],
    imports: [CommonModule, FontAwesomeModule, NgbModule, MatDialogModule, UserMenagementModule],
    exports: [ProfileComponent],
})
export class ProfileModule {}
