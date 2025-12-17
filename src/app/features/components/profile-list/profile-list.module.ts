import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileModule } from '../profile/profile.module';
import { ProfileListComponent } from './profile-list.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
    declarations: [ProfileListComponent],
    imports: [CommonModule, ProfileModule, TranslateModule],
    exports: [ProfileListComponent],
})
export class ProfileListModule {}
