import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import { UserService } from "../../services/user.service";
import { PostService } from "../../services/post/post.service";
import { global } from "../../global";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public token;
  public user;
  public status;
  public url: string;
  public id;
  public posts;
  public identity;
  public page;

  constructor(
    private _userService: UserService,
    private _postService: PostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { 
    this.token = this._userService.getToken();
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.page = "profile";
  }

  ngOnInit(): void {
    this.getPerilAndPosts();
  }

  getPerilAndPosts(){
    this._activatedRoute.params.subscribe(
      params=>{
        this.id = params.id;

        this._userService.getUser(this.token, this.id).subscribe(
          response=>{
            if(response.status == "success"){
              this.user = response.user;
              console.log(this.user);
              this.status = "success";

            }else{
              this.status = "error";
            }
          },
          error=>{
            this.status = "error";
            console.log(error);
          }
        )
      }
    );

    this._postService.getPostsByUser(this.id).subscribe(
      response=>{
        if(response.status == "success"){

          this.posts = response.posts;
          this.status = "success";

        }else{
          this.status = "error";
        }
      },
      error=>{
        this.status = "error";
        console.log(error);
      }
    )
  }



}
