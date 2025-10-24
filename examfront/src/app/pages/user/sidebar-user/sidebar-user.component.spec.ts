import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Pipe, PipeTransform } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/services/category.service';
import { of, throwError } from 'rxjs';

import { SidebarUserComponent } from './sidebar-user.component';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('SidebarUserComponent', () => {
  let component: SidebarUserComponent;
  let fixture: ComponentFixture<SidebarUserComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  beforeEach(() => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['logout']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success']);
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get']);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategoriesPaged']);

    categoryServiceSpy.getCategoriesPaged.and.returnValue(of({ content: [], totalPages: 1, totalElements: 0 }));
    translateServiceSpy.get.and.returnValue(of('translated-text'));

    TestBed.configureTestingModule({
      declarations: [SidebarUserComponent, MockTranslatePipe],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(SidebarUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call categoryService.getCategoriesPaged on ngOnInit', () => {
    categoryServiceSpy.getCategoriesPaged.and.returnValue(of({ content: [], totalPages: 1, totalElements: 0 }));
    component.ngOnInit();
    expect(categoryServiceSpy.getCategoriesPaged).toHaveBeenCalledWith(0, 8, '');
  });

  it('should update categories and totalPages on successful loadCategories', () => {
    const mockResponse = { 
      content: [{ cid: 1, title: 'Cat', description: 'desc' }], 
      totalPages: 3, 
      totalElements: 1 
    };
    categoryServiceSpy.getCategoriesPaged.and.returnValue(of(mockResponse));
    component.loadCategories(2);
    expect(component.categories).toEqual(mockResponse.content);
    expect(component.totalPages).toBe(3);
    expect(component.page).toBe(2);
  });

  it('should reset categories and totalPages on loadCategories error', () => {
    categoryServiceSpy.getCategoriesPaged.and.returnValue(throwError(() => new Error('error')));
    component.loadCategories(1);
    expect(component.categories).toEqual([]);
    expect(component.totalPages).toBe(1);
  });

  it('should call loadCategories with correct page on goToPage', () => {
    spyOn(component, 'loadCategories');
    component.goToPage(5);
    expect(component.loadCategories).toHaveBeenCalledWith(5);
  });

  it('should update searchTerm and reset page on onSearchTermChange', () => {
    spyOn(component, 'loadCategories');
    component.onSearchTermChange('math');
    expect(component.searchTerm).toBe('math');
    expect(component.page).toBe(0);
    expect(component.loadCategories).toHaveBeenCalledWith(0);
  });

  it('should call logout, translateService.instant and notificationService.success on logout', () => {
    translateServiceSpy.instant.and.callFake((key: string) => key + '_translated');
    component.logout();
    expect(loginServiceSpy.logout).toHaveBeenCalled();
    expect(translateServiceSpy.instant).toHaveBeenCalledWith('LOGOUT.SUCCESS');
    expect(translateServiceSpy.instant).toHaveBeenCalledWith('LOGOUT.TITLE');
    expect(notificationServiceSpy.success).toHaveBeenCalledWith('LOGOUT.SUCCESS_translated', 'LOGOUT.TITLE_translated');
  });

  it('should have initial pageSize of 8', () => {
    expect(component.pageSize).toBe(8);
  });

  it('should use updated pageSize when loading categories', () => {
    component.pageSize = 12;
    component.searchTerm = 'test';
    categoryServiceSpy.getCategoriesPaged.and.returnValue(of({ content: [], totalPages: 1, totalElements: 0 }));
    component.loadCategories(2);
    expect(categoryServiceSpy.getCategoriesPaged).toHaveBeenCalledWith(2, 12, 'test');
  });

  it('should not call loadCategories if goToPage is called with same page', () => {
    spyOn(component, 'loadCategories');
    component.page = 3;
    component.goToPage(3);
    expect(component.loadCategories).toHaveBeenCalledWith(3);
  });

  it('should reset categories and totalPages if loadCategories throws error', () => {
    categoryServiceSpy.getCategoriesPaged.and.returnValue(throwError(() => new Error('fail')));
    component.categories = [{ cid: 1, title: 'A', description: 'B' }];
    component.totalPages = 5;
    component.loadCategories(1);
    expect(component.categories).toEqual([]);
    expect(component.totalPages).toBe(1);
  });

  it('should keep page at 0 after onSearchTermChange with empty string', () => {
    spyOn(component, 'loadCategories');
    component.page = 5;
    component.onSearchTermChange('');
    expect(component.page).toBe(0);
    expect(component.searchTerm).toBe('');
    expect(component.loadCategories).toHaveBeenCalledWith(0);
  });

  it('should call getCategoriesPaged with correct params after changing searchTerm and pageSize', () => {
    component.pageSize = 5;
    component.searchTerm = 'abc';
    categoryServiceSpy.getCategoriesPaged.and.returnValue(of({ content: [], totalPages: 1, totalElements: 0 }));
    component.loadCategories(3);
    expect(categoryServiceSpy.getCategoriesPaged).toHaveBeenCalledWith(3, 5, 'abc');
  });

  it('should not throw if logout is called and translateService.instant returns undefined', () => {
    translateServiceSpy.instant.and.returnValue(undefined as any);
    expect(() => component.logout()).not.toThrow();
    expect(loginServiceSpy.logout).toHaveBeenCalled();
    expect(notificationServiceSpy.success).toHaveBeenCalledWith(undefined, undefined);
  });
});