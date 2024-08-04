import { Component, OnInit } from '@angular/core';
import { PostService } from "../../services/post/post.service";
import { UserService } from "../../services/user.service";
import {global} from "../../global";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public posts;
  public url: string; 
  public identity;
  public token;
  public page;
  constructor(
    private _userService: UserService,
    private _postService: PostService

  ) {
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.page = "inicio";
   }

  ngOnInit(): void {
   this.getPosts();
  }

  getPosts(){
    this._postService.getPosts().subscribe(
      response=>{
        this.posts = response.posts;
      },
      error=>{
        console.log(error);
      }
    )
  }

  deletePost(id){
    this._postService.deletePost(this.token, id).subscribe(
      response=>{
        console.log(response);
          this.getPosts();

      },
      error=>{
        console.log(error);
      }
    )
  }

}
