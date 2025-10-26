import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionsComponent } from './instructions.component';
import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from 'src/app/services/notification.service';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('InstructionsComponent', () => {
  let component: InstructionsComponent;
  let fixture: ComponentFixture<InstructionsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let notificationServiceSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get', 'instant']);
    translateServiceSpy.get.and.returnValue(of('translated-text'));
    translateServiceSpy.instant.and.returnValue('translated-text');
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['confirm', 'error']);
    notificationServiceSpy.confirm.and.returnValue(Promise.resolve(true)); 

    await TestBed.configureTestingModule({
      declarations: [InstructionsComponent, MockTranslatePipe],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {},
              data: {},
            },
            params: of({}),
            queryParams: of({}),
            data: of({})
          }
        },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: 'NotificationService', useValue: notificationServiceSpy }, 
        { provide: NotificationService, useValue: notificationServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate when startQuiz is called', async () => {
    component.quiz = { qId: 1, title: 'Test Quiz', description: 'desc' } as any;
    await component.startQuiz(1); 
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should render instructions in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('INSTRUCTIONS');
  });
});
