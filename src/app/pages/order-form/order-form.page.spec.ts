import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderFormPage } from './order-form.page';

describe('OrderFormPage', () => {
  let component: OrderFormPage;
  let fixture: ComponentFixture<OrderFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
