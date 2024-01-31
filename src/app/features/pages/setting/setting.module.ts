import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [SettingComponent],
    imports: [CommonModule, FontAwesomeModule, SettingRoutingModule, FormsModule, ReactiveFormsModule],
})
export class SettingModule {}
