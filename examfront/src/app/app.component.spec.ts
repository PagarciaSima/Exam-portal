import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have selector "app-root"', () => {
    const annotations = Reflect.getOwnPropertyDescriptor(AppComponent, '__annotations__')?.value;
    const selector = annotations ? annotations[0].selector : (AppComponent as any).ɵcmp?.selectors[0][0];
    expect(selector).toBe('app-root');
  });
});
