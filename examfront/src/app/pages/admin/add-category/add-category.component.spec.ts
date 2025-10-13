import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AddCategoryComponent } from './add-category.component';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;
  let mockCategoryService: any;
  let mockNotificationService: any;
  let mockRouter: any;
  let mockTranslate: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockCategoryService = {
      getCategory: jasmine.createSpy('getCategory').and.returnValue(of({ cid: 1, title: 'Test', description: 'Desc' })),
      addCategory: jasmine.createSpy('addCategory').and.returnValue(of({})),
      updateCategory: jasmine.createSpy('updateCategory').and.returnValue(of({}))
    };
    mockNotificationService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockTranslate = { instant: (key: string) => key };
    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => null
      })
    };

    await TestBed.configureTestingModule({
      declarations: [ 
        AddCategoryComponent,
        MockTranslatePipe
      ],
      imports: [ 
        MatSnackBarModule, 
        HttpClientTestingModule, 
        FormsModule, 
        BrowserAnimationsModule 
      ],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in add mode if no cid param', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.category).toEqual({ cid: 0, title: '', description: '' });
  });

  it('should initialize in edit mode if cid param exists', () => {
    mockActivatedRoute.paramMap = of({
      get: (key: string) => key === 'cid' ? '1' : null
    });
    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    spyOn(component as any, 'loadCategory');
    component.ngOnInit();
    expect(component.isEditMode).toBeTrue();
    expect((component as any).loadCategory).toHaveBeenCalledWith(1);
  });

  it('should call addCategory on formSubmit if not edit mode', () => {
    spyOn(component as any, 'addCategory');
    component.isEditMode = false;
    component.formSubmit();
    expect((component as any).addCategory).toHaveBeenCalled();
  });

  it('should call editCategory on formSubmit if edit mode', () => {
    spyOn(component as any, 'editCategory');
    component.isEditMode = true;
    component.formSubmit();
    expect((component as any).editCategory).toHaveBeenCalled();
  });

  it('should show success and navigate after addCategory', () => {
    component.category = { cid: 0, title: 'Test', description: 'Desc' };
    (component as any).addCategory();
    expect(mockNotificationService.success).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/categories']);
  });

  it('should show error on addCategory failure', () => {
    mockCategoryService.addCategory.and.returnValue(throwError(() => new Error('error')));
    component.category = { cid: 0, title: 'Test', description: 'Desc' };
    (component as any).addCategory();
    expect(mockNotificationService.error).toHaveBeenCalled();
  });

  it('should show success and navigate after editCategory', () => {
    component.category = { cid: 1, title: 'Test', description: 'Desc' };
    (component as any).editCategory();
    expect(mockNotificationService.success).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/categories']);
  });

  it('should show error on editCategory failure', () => {
    mockCategoryService.updateCategory.and.returnValue(throwError(() => new Error('error')));
    component.category = { cid: 1, title: 'Test', description: 'Desc' };
    (component as any).editCategory();
    expect(mockNotificationService.error).toHaveBeenCalled();
  });

  it('should reset form and category on resetForm', () => {
    component.category = { cid: 5, title: 'Test', description: 'Desc' };
    component.categoryForm = jasmine.createSpyObj('NgForm', ['resetForm']);
    (component as any).resetForm();
    expect(component.category).toEqual({ cid: 0, title: '', description: '' });
    expect(component.categoryForm.resetForm).toHaveBeenCalled();
  });
});

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}