import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root',
})
export class IdleService {
    private idleTimeout: number = 30 * 60 * 1000; // 30 minutes in milliseconds
    private idleTimer: any;
    private lastActivity: number = Date.now();
    private isIdle: boolean = false;
    
    private idleState$ = new Subject<boolean>();
    private warningTime: number = 5 * 60 * 1000; // 5 minutes before timeout
    private warningTimer: any;
    private warningShown: boolean = false;
    private activityHandler: () => void;
    private listenersAttached: boolean = false;

    constructor(
        private router: Router,
        private tokenService: TokenService,
        private userService: UserService,
    ) {
        // Bind activity handler เพื่อให้สามารถลบได้
        this.activityHandler = () => this.onUserActivity();
    }

    /**
     * ตั้งค่า idle timeout (ในนาที)
     */
    setIdleTimeout(minutes: number): void {
        this.idleTimeout = minutes * 60 * 1000;
        this.resetTimer();
    }

    /**
     * เริ่มต้นการตรวจสอบ idle timeout
     */
    start(): void {
        this.resetTimer();
        this.setupActivityListeners();
    }

    /**
     * หยุดการตรวจสอบ idle timeout
     */
    stop(): void {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
        this.removeActivityListeners();
    }

    /**
     * รีเซ็ต timer เมื่อมีการใช้งาน
     */
    resetTimer(): void {
        this.lastActivity = Date.now();
        this.isIdle = false;
        this.warningShown = false;
        this.idleState$.next(false);

        // Clear existing timers
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
        }

        // Set warning timer (5 minutes before timeout)
        const warningDelay = this.idleTimeout - this.warningTime;
        if (warningDelay > 0) {
            this.warningTimer = setTimeout(() => {
                if (!this.warningShown) {
                    this.showWarning();
                }
            }, warningDelay);
        }

        // Set idle timeout timer
        this.idleTimer = setTimeout(() => {
            this.handleIdleTimeout();
        }, this.idleTimeout);
    }

    /**
     * ตรวจสอบสถานะ idle
     */
    isUserIdle(): boolean {
        return this.isIdle;
    }

    /**
     * Observable สำหรับสถานะ idle
     */
    onIdleStateChange(): Observable<boolean> {
        return this.idleState$.asObservable();
    }

    /**
     * ตั้งค่า event listeners สำหรับตรวจสอบ user activity
     */
    private setupActivityListeners(): void {
        if (this.listenersAttached) {
            return; // ป้องกันการเพิ่ม listeners ซ้ำ
        }
        
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach((event) => {
            document.addEventListener(event, this.activityHandler, true);
        });
        this.listenersAttached = true;
    }

    /**
     * ลบ event listeners
     */
    private removeActivityListeners(): void {
        if (!this.listenersAttached) {
            return; // ถ้ายังไม่ได้เพิ่ม listeners ก็ไม่ต้องลบ
        }
        
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach((event) => {
            document.removeEventListener(event, this.activityHandler, true);
        });
        this.listenersAttached = false;
    }

    /**
     * เมื่อมีการใช้งาน
     */
    private onUserActivity(): void {
        if (this.isIdle) {
            // ถ้า idle อยู่แล้ว ให้รีเซ็ต
            this.isIdle = false;
            this.warningShown = false;
            this.idleState$.next(false);
        }
        this.resetTimer();
    }

    /**
     * แสดง warning ก่อน timeout
     */
    private showWarning(): void {
        this.warningShown = true;
        // สามารถเพิ่ม notification หรือ modal แจ้งเตือนได้ที่นี่
        console.warn(`You will be logged out due to inactivity in ${this.warningTime / 60000} minutes`);
    }

    /**
     * จัดการเมื่อ idle timeout
     */
    private handleIdleTimeout(): void {
        this.isIdle = true;
        this.idleState$.next(true);
        
        console.warn('Idle timeout - logging out due to inactivity');
        
        // Clear token และ user data
        this.tokenService.clearDataToken();
        this.userService.clearDataUser();
        
        // Redirect ไปหน้า login
        this.router.navigate(['/login']);
    }
}
