import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HeaderComponent } from './header/header.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    BaseChartDirective,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), provideCharts(withDefaultRegisterables())],
  bootstrap: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    HeaderComponent
  ],
})
export class AppModule {}
