import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { CONFIG } from '../config/config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [
                AppRoutingModule,
                LoggerModule.forRoot({
                    level: CONFIG.logLevel === 'debug' ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.ERROR
                })
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it(`It should success, app component`, () => {
        expect(component).toBeTruthy();
    });
});
