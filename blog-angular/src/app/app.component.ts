import { Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { global } from "./global";
import { UserService } from "./services/user.service";
import { CategoryService } from "./services/category.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, CategoryService]
})
export class AppComponent implements OnInit, DoCheck {
  title = 'blog-angular';
  public token;
  public identity;
  public url;
  public categories;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { 

    this.url = global.url;

  }

  ngOnInit(){
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.getCategories();
  }

  ngDoCheck(){
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response=>{
        if(response.status && response.status == "success"){ 
        this.categories = response.categories
        }
      },error=>{
        console.log(error);
      }
    )
  }


}


