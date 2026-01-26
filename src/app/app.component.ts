import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SocketIoService } from './services/socket-io/socket-io.service';
import { UserService } from './services/user/user.service';
import { User } from './shared/interface/user.interface';
import { LoaderService } from './services/loader/loader.service';
import { TranslateService } from './services/translate/translate.service';
import { TokenService } from './services/token/token.service';
import { IdleService } from './services/idle/idle.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'qcrm-ui';

    userData?: User | null;
    isLoading: boolean = false;
    private tokenCheckInterval: any;

    constructor(
        private socketIO: SocketIoService,
        private userService: UserService,
        private loaderService: LoaderService,
        private translateService: TranslateService,
        private tokenService: TokenService,
        private router: Router,
        private idleService: IdleService,
    ) {
        // Translation is now preloaded via APP_INITIALIZER in app.module.ts
    }

    async ngOnInit() {
        this.initzation();
        this.startTokenExpirationCheck();
        this.startIdleTimeout();
    }

    ngOnDestroy(): void {
        if (this.tokenCheckInterval) {
            clearInterval(this.tokenCheckInterval);
        }
        this.idleService.stop();
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

    /**
     * ตรวจสอบ token expiration แบบ periodic (ทุก 5 นาที)
     * และ redirect ไปหน้า login เมื่อ token หมดอายุจริงๆ (ไม่ใช่แค่ใกล้หมดอายุ)
     */
    private startTokenExpirationCheck(): void {
        // ตรวจสอบทุก 5 นาที (300000 milliseconds) เพื่อลดการตรวจสอบที่บ่อยเกินไป
        this.tokenCheckInterval = setInterval(() => {
            // ตรวจสอบเฉพาะเมื่อมี token อยู่
            const token = this.tokenService.getDataToken();
            // ตรวจสอบว่า token หมดอายุจริงๆ (ไม่ใช้ buffer) เพื่อไม่ให้เด้งก่อนเวลา
            if (token && this.tokenService.isTokenExpired(0)) {
                console.warn('Token expired - redirecting to login');
                this.handleTokenExpiration();
            }
        }, 300000); // ตรวจสอบทุก 5 นาที

        // ตรวจสอบทันทีเมื่อ component ถูกสร้าง (เฉพาะเมื่อหมดอายุจริงๆ)
        const token = this.tokenService.getDataToken();
        if (token && this.tokenService.isTokenExpired(0)) {
            this.handleTokenExpiration();
        }
    }

    /**
     * จัดการเมื่อ token หมดอายุ
     */
    private handleTokenExpiration(): void {
        // หยุด idle timeout
        this.idleService.stop();
        
        // Clear token และ user data
        this.tokenService.clearDataToken();
        this.userService.clearDataUser();
        
        // Navigate ไปหน้า login
        this.router.navigate(['/login']);
    }

    /**
     * เริ่มต้นการตรวจสอบ idle timeout
     */
    private startIdleTimeout(): void {
        // อ่านค่า idle timeout จาก environment config (default: 30 นาที)
        const idleTimeoutMinutes = environment.idle?.timeoutMinutes || 30;
        this.idleService.setIdleTimeout(idleTimeoutMinutes);
        
        // เริ่มต้นการตรวจสอบ
        this.idleService.start();
        
        // ตรวจสอบว่ามี token อยู่หรือไม่ก่อนเริ่ม idle timeout
        const token = this.tokenService.getDataToken();
        if (!token) {
            this.idleService.stop();
        }
    }
}
