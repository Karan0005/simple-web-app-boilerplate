import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RestApiService } from './services';

@NgModule({
    declarations: [PageNotFoundComponent, LandingPageComponent],
    imports: [
        CommonModule,
        ToastrModule.forRoot({
            preventDuplicates: true
        })
    ],
    providers: [RestApiService]
})
export class SharedModule {}
