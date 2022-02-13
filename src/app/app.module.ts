import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
// import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
// import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';

import { ListboxModule } from 'primeng/listbox';
// import { MenuModule } from 'primeng/menu';
// import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
// import { SplitButtonModule } from 'primeng/splitbutton';
// import { TableModule } from 'primeng/table';
// import { TabViewModule } from 'primeng/tabview';
// import { ToggleButtonModule } from 'primeng/togglebutton';
// import { ToolbarModule } from 'primeng/toolbar';
// import { TooltipModule } from 'primeng/tooltip';
// import { TreeTableModule } from 'primeng/treetable';

import { AppService } from './app.service';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    // BreadcrumbModule,
    ButtonModule,
    CheckboxModule,
    // DialogModule,
    DropdownModule,
    // InputTextareaModule,
    InputTextModule,
    ListboxModule,
    // MenuModule,
    // OverlayPanelModule,
    SelectButtonModule,
    // SplitButtonModule,
    // TableModule,
    // TabViewModule,
    // ToggleButtonModule,
    // ToolbarModule,
    // TooltipModule,
    // TreeTableModule
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
