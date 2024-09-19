import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CONFIG } from '../config/config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    constructor(private loggerService: NGXLogger) {
        this.loggerService.info(CONFIG.environment);
    }
}
