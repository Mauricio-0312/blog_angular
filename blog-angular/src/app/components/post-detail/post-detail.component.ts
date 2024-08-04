import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { PostService } from "../../services/post/post.service";
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  public post;
  public status;
  public identity;

  constructor(
    private _userService: UserService,
    private _postService: PostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute

  ) {
    this.identity = this._userService.getIdentity();
   }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(){
    this._activatedRoute.params.subscribe(
      params=>{
        let id = params.id;
        this._postService.getPost(id).subscribe(
          response=>{
            if(response.status == "success"){
              this.post = response.post;
              this.status = "success";
            }else{
              this.status = "error";
            }
          },
          error=>{
            this.status = "error";
          }
        )
      }
    )
  }

  
}
