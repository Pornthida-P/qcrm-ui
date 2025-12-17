import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountProfileComponent } from './account-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
    declarations: [AccountProfileComponent],
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, TranslateModule],
    exports: [AccountProfileComponent],
})
export class AccountProfileModule {}
