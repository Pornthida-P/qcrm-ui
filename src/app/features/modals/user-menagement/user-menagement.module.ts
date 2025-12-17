import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenagementComponent } from './user-menagement.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountProfileModule } from '../../components/account-profile/account-profile.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
    declarations: [UserMenagementComponent],
    imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, FormsModule, AccountProfileModule, TranslateModule],
    exports: [UserMenagementComponent],
})
export class UserMenagementModule {}
