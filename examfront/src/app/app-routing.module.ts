import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { NormalGuard } from './guards/normal.guard';
import { AddCategoryComponent } from './pages/admin/add-category/add-category.component';
import { AddQuestionComponent } from './pages/admin/add-question/add-question.component';
import { AddQuizComponent } from './pages/admin/add-quiz/add-quiz.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ViewCategoriesComponent } from './pages/admin/view-categories/view-categories.component';
import { ViewQuizQuestionsComponent } from './pages/admin/view-quiz-questions/view-quiz-questions.component';
import { ViewQuizzesComponent } from './pages/admin/view-quizzes/view-quizzes.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import { InstructionsComponent } from './pages/user/instructions/instructions.component';
import { LoadQuizComponent } from './pages/user/load-quiz/load-quiz.component';
import { StartComponent } from './pages/user/start/start.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { ReviewQuizComponent } from './pages/user/review-quiz/review-quiz.component';
import { UserHomeComponent } from './pages/user/user-home/user-home.component';
import { RedirectHomeComponent } from './pages/redirect-home/redirect-home.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';

const routes: Routes = [
  {
    path: '',
    component: RedirectHomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  // ADMIN ROUTES
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: { animation: 'ProfilePage' }
      },
      {
        path: 'categories',
        component: ViewCategoriesComponent,
        data: { animation: 'CategoriesPage' }
      },
      {
        path: 'add-category',
        component: AddCategoryComponent,
        data: { animation: 'AddCategoryPage' }
      },
      {
        path: 'add-category/:cid', // Edit category route
        component: AddCategoryComponent,
        data: { animation: 'EditCategoryPage' }
      },
      {
        path: 'quizzes',
        component: ViewQuizzesComponent,
        data: { animation: 'QuizzesPage' }
      },
      {
        path: 'add-quiz',
        component: AddQuizComponent,
        data: { animation: 'AddQuizPage' }
      },
      {
        path: 'add-quiz/:qid', // Edit quiz route
        component: AddQuizComponent,
        data: { animation: 'EditQuizPage' }
      },
      {
        path: 'view-questions/:id/:title', // View quiz questions route
        component: ViewQuizQuestionsComponent,
        data: { animation: 'ViewQuizQuestionsPage' }
      },
      {
        path: 'add-question/:qid/:title', // Add question route
        component: AddQuestionComponent,
        data: { animation: 'addQuestion' }
      },
      {
        path: 'add-question/:qid/:title/:quesId', // Edit question route
        component: AddQuestionComponent,
        data: { animation: 'editQuestion' }
      },
      {
        path: '',
        component: AdminHomeComponent,
        pathMatch: 'full'
      },

    ]
  },
  // NORMAL USER ROUTES
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [NormalGuard],
    children: [

      {
        path: ':catId',
        component: LoadQuizComponent,
        data: { animation: 'LoadQuizPage' }
      },  
      {
        path: 'instructions/:qId',
        component: InstructionsComponent,
        data: { animation: 'InstructionsPage' }
      },
      {
        path: '',
        component: UserHomeComponent,
        pathMatch: 'full'
      },
      
    ]
  },

  {
    path: 'start/:qId',
    component: StartComponent,
    canActivate: [NormalGuard], 
    data: { animation: 'StartQuizPage' }
  },
  {
    path: 'review-quiz',
    component: ReviewQuizComponent,
    data: { animation: 'ReviewQuizPage' }
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
