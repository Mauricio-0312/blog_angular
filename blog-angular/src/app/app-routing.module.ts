import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { CategoryCreateComponent } from './components/category-create/category-create.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import {IdentityGuard} from "./services/identity.guard";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "inicio", component: HomeComponent},
  {path: "registro", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  {path: "ajustes", component: UserEditComponent, canActivate: [IdentityGuard]},
  {path: "logout/:sure", component: LoginComponent},
  {path: "post/create", component: PostNewComponent, canActivate: [IdentityGuard]},
  {path: "post/detail/:id", component: PostDetailComponent},
  {path: "post/edit/:id", component: PostEditComponent, canActivate: [IdentityGuard]},
  {path: "profile/:id", component: ProfileComponent, canActivate: [IdentityGuard]},
  {path: "category/post/:id", component: CategoryDetailComponent},
  {path: "category/create", component: CategoryCreateComponent, canActivate: [IdentityGuard]},
  {path: "**", component: ErrorComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
