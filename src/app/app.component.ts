import { Component, OnInit } from '@angular/core';
import { SocketIoService } from './services/socket-io/socket-io.service';
import { UserService } from './services/user/user.service';
import { User } from './shared/interface/user.interface';
import { LoaderService } from './services/loader/loader.service';
import { TranslateService } from './services/translate/translate.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'qcrm-ui';

    userData?: User | null;
    isLoading: boolean = false;
    constructor(
        private socketIO: SocketIoService,
        private userService: UserService,
        private loaderService: LoaderService,
        private translateService: TranslateService,
    ) {
        // Translation is now preloaded via APP_INITIALIZER in app.module.ts
    }

    async ngOnInit() {
        this.initzation();
    }

    async initzation() {
        this.getDataUser();
        this.loaderStatus();
        setTimeout(() => {
            this.login();
        }, 1000);
    }

    getDataUser(): void {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
        });
    }

    login() {
        if (this.userData) {
            this.socketIO.login(this.userData);
        }
    }

    loaderStatus() {
        this.loaderService.getLoaderStatus().subscribe((res) => {
            this.isLoading = res;
        });
    }
}
