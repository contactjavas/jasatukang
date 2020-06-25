import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderFormPageRoutingModule } from './order-form-routing.module';

import { OrderFormPage } from './order-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OrderFormPageRoutingModule
  ],
  declarations: [OrderFormPage]
})
export class OrderFormPageModule { }
