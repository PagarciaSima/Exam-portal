import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';

class MockLanguageService {
  getLanguage() { return 'en'; }
  setLanguage(lang: string) {}
}

class MockLoadingService {
  show() {}
  hide() {}
}

class MockLoginService {
  user$ = new BehaviorSubject(null);
  logout() {}
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    const onLangChangeSubject = new Subject();

    translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'get', 'instant', 'use', 'setDefaultLang', 'addLangs', 'getBrowserLang', 
      'getLangs', 'getTranslation', 'stream', 'set'
    ], {
      onLangChange: onLangChangeSubject.asObservable(),
      onTranslationChange: new Subject().asObservable(),
      onDefaultLangChange: new Subject().asObservable()
    });

    translateServiceSpy.get.and.returnValue(of('translated-text'));
    translateServiceSpy.instant.and.returnValue('translated-text');
    translateServiceSpy.use.and.returnValue(of('en'));
    translateServiceSpy.getBrowserLang.and.returnValue('en');
    translateServiceSpy.getLangs.and.returnValue(['en', 'es']);
    translateServiceSpy.getTranslation.and.returnValue(of({}));
    translateServiceSpy.stream.and.returnValue(of('translated-text'));

    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [ 
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatMenuModule
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: 'LanguageService', useClass: MockLanguageService },
        { provide: 'LoadingService', useClass: MockLoadingService },
        { provide: 'LoginService', useClass: MockLoginService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(NavbarComponent, {
      set: {
        providers: [
          { provide: TranslateService, useValue: translateServiceSpy },
          { provide: LanguageService, useClass: MockLanguageService },
          { provide: LoadingService, useClass: MockLoadingService },
          { provide: LoginService, useClass: MockLoginService }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});