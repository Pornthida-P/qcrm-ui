import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ELearningComponent } from './e-learning.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';
import {PaginatorModule} from 'primeng/paginator';
import {SidebarModule} from 'primeng/sidebar';

@NgModule({
    declarations: [ELearningComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ELearningComponent,
            },
        ]),
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        TableModule,
        FontAwesomeModule,
        TooltipModule,
        PaginatorModule,
        SidebarModule,
    ],
})
export class ELearningModule {}
