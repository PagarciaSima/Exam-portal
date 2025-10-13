import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddQuizComponent } from './add-quiz.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddQuizComponent', () => {
  let component: AddQuizComponent;
  let fixture: ComponentFixture<AddQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuizComponent ],
      imports: [
        HttpClientTestingModule, // Para servicios que usan HttpClient
        MatSnackBarModule,       // Para NotificationService
        TranslateModule.forRoot(), // Para TranslateService
        FormsModule,             // Para NgForm y ViewChild
        RouterTestingModule      // Para ActivatedRoute y Router
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
