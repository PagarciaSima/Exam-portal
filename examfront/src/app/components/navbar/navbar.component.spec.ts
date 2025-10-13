import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    // Crear un Subject para onLangChange
    const onLangChangeSubject = new Subject();

    translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'get', 'instant', 'use', 'setDefaultLang', 'addLangs', 'getBrowserLang', 
      'getLangs', 'getTranslation', 'stream', 'set'
    ], {
      // Propiedades del servicio que el pipe necesita
      onLangChange: onLangChangeSubject.asObservable(),
      onTranslationChange: new Subject().asObservable(),
      onDefaultLangChange: new Subject().asObservable()
    });

    // Configurar los spies
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
        // Importar TranslateModule sin forRoot para testing
        TranslateModule.forRoot(),
        MatMenuModule
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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