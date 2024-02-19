import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';
import { SocketIoService } from './services/socket-io/socket-io.service';
import { UserService } from './services/user/user.service';
import { tap } from 'rxjs';
import { User } from './shared/interface/user.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'qcrm-ui';

    constructor(private themeService: ThemeService, private socketIO: SocketIoService, private userService: UserService) {}

    async ngOnInit() {
        this.setTheme();
        await this.getUserData();
    }

    setTheme() {
        const savedTheme = this.themeService.getSavedTheme();
        if (savedTheme) {
            this.themeService.setThemeVariables(savedTheme.primaryColor, savedTheme.primaryActiveColor);
        }
    }

    getUserData() {
        this.userService
            .getDataUser()
            .pipe(
                tap((res: User | null) => {
                    this.socketIO.login(res);
                }),
            )
            .subscribe(() => {});
    }
}
