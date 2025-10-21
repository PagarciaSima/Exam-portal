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
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import { InstructionsComponent } from './pages/user/instructions/instructions.component';
import { LoadQuizComponent } from './pages/user/load-quiz/load-quiz.component';
import { StartComponent } from './pages/user/start/start.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';

const routes: Routes = [
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
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { animation: 'WelcomePage' }
      },
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

    ]
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [NormalGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { animation: 'WelcomePage' }
      },
      {
        path: ':catId',
        component: LoadQuizComponent,
        data: { animation: 'LoadQuizPage' }
      },  
      {
        path: 'instructions/:qId',
        component: InstructionsComponent,
        data: { animation: 'InstructionsPage' }
      }
    ]
  },
  {
    path: '',
    component: HomeComponent,
    data: { animation: 'WelcomePage' }
  },
  {
    path: 'start/:qId',
    component: StartComponent,
    canActivate: [NormalGuard], // si quieres protegerla igual que el dashboard
    data: { animation: 'StartQuizPage' }
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
