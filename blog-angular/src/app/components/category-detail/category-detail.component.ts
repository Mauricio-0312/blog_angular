import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import { PostService } from "../../services/post/post.service";
import { UserService } from "../../services/user.service";
import { CategoryService } from "../../services/category.service";
import { Category } from 'src/app/models/category';
import {global} from "../../global";

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  public id;
  public status;
  public category: Category;
  public posts;
  public url;
  public identity;
  public token;
  public page;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _postService: PostService,
    private _categoryService: CategoryService
  ) {
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.page = "category";
   }

  ngOnInit(): void {
    this.getPostsByCategory();
  }

  getPostsByCategory(){
    //Get category id
    this._activatedRoute.params.subscribe(
      params=>{
        if(params.id){
          this.id = params.id;
          console.log(this.id);

          //Get category
          this._categoryService.getCategory(this.id).subscribe(
            response=>{
              if(response.status =="success"){
                this.category = response.category;
                this.status = "success";

                //Get posts by category
                this._postService.getPostsByCategory(this.id).subscribe(
                  response=>{
                    if(response.status == "success"){
                      this.posts = response.posts;
                    }else{
                      this.status = "error";
                    }
                  },
                  error=>{
                    console.log(error);
                  }
                )
              }else{
                this.status = "error";
              }
            },
            error=>{
              this.status = "error";
              console.log(error);
            }
          )
        }else{
          this.status = "error";
        }
      }
    )
  }

  deletePost(id){
    this._postService.deletePost(this.token, id).subscribe(
      response=>{
        console.log(response);
          this.getPostsByCategory();

      },
      error=>{
        console.log(error);
      }
    )
  }

}
