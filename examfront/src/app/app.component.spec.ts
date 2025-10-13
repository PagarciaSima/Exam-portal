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

  it('should have title property set to "examfront"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('examfront');
  });

  it('should render the title in the template if interpolation is used', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // This test will only pass if the template contains {{ title }}
    expect(compiled.textContent).toContain('examfront');
  });

  it('should have selector "app-root"', () => {
    const annotations = Reflect.getOwnPropertyDescriptor(AppComponent, '__annotations__')?.value;
    const selector = annotations ? annotations[0].selector : (AppComponent as any).ɵcmp?.selectors[0][0];
    expect(selector).toBe('app-root');
  });
});