import { Component } from '@angular/core';
import { CONFIG } from '../config/config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'frontend';
    appEnvironment = CONFIG.environment;
}
