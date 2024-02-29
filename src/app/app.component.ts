import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';
import { SocketIoService } from './services/socket-io/socket-io.service';
import { UserService } from './services/user/user.service';
import { tap } from 'rxjs';
import { User } from './shared/interface/user.interface';
import { LoaderService } from './services/loader/loader.service';

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
        private themeService: ThemeService,
        private socketIO: SocketIoService,
        private userService: UserService,
        private loaderService: LoaderService,
    ) {}

    async ngOnInit() {
        this.initzation();
    }

    async initzation() {
        this.setTheme();
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

    setTheme() {
        const savedTheme = this.themeService.getSavedTheme();
        if (savedTheme) {
            this.themeService.setThemeVariables(savedTheme.primaryColor, savedTheme.primaryActiveColor);
        }
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
