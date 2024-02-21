import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagListComponent } from './tag-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { TableListModule } from '../table-list/table-list.module';

@NgModule({
    declarations: [TagListComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatMenuModule,
        TableListModule,
    ],
    exports: [TagListComponent],
})
export class TagListModule {}
