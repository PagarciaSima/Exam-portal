import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(() => {
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot() // <-- Añade esto
      ],
      providers: [
        { provide: Location, useValue: locationSpy },
        TranslateService
      ]
    });

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back when goBack is called', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
