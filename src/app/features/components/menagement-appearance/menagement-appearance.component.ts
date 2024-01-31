import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-menagement-appearance',
    templateUrl: './menagement-appearance.component.html',
    styleUrl: './menagement-appearance.component.scss',
})
export class MenagementAppearanceComponent implements OnInit {
    appearance: any = {};

    ngOnInit(): void {
        this.appearance = {
            backgroundColor: '#ffffff',
            textColor: '#000000',
        };
    }
}
