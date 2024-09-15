import { Component } from '@angular/core';
import { CONFIG } from '../../../../config/config';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
    currentYear: number = new Date().getFullYear();
    title = 'frontend';
    appEnvironment = CONFIG.environment;
}
