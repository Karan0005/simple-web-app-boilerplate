import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { CONFIG } from '../config/config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LoggerModule.forRoot({
            level: CONFIG.logLevel === 'debug' ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.ERROR
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
