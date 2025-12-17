import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactImportManagementComponent } from './contact-import-management.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoaderModule } from '../../components/loader/loader.module';

@NgModule({
    declarations: [ContactImportManagementComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatDialogModule, TranslateModule, LoaderModule],
    exports: [ContactImportManagementComponent],
})
export class ContactImportManagementModule {}
