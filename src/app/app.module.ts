import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './features/components/footer/footer.component';
import { UserComponent } from './features/modals/user/user.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Formio, FormioModule } from '@formio/angular';
import bootstrap4 from '@formio/bootstrap/bootstrap4';
(Formio as any).use(bootstrap4);

@NgModule({
    declarations: [AppComponent, FooterComponent, UserComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, FontAwesomeModule, FormioModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
