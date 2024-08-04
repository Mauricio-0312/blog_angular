import { Component, OnInit, Input } from '@angular/core';
import { UserService } from "../../services/user.service";
import { PostService } from "../../services/post/post.service";
import { Category } from 'src/app/models/category';


@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {
  @Input() posts;
  @Input() identity;
  @Input() url;
  @Input() page;
  @Input() category_id
  @Input() user_id



  public token;

  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) { 
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
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

  getPosts(){
    if(this.page == "inicio"){
      this._postService.getPosts().subscribe(
        response=>{
          this.posts = response.posts;
        },
        error=>{
          console.log(error)
        }
      )
    }

    if(this.page == "category"){
      this._postService.getPostsByCategory(this.category_id).subscribe(
        response=>{
          this.posts = response.posts;
        },
        error=>{
          console.log(error)
        }
      )
    }

    
    if(this.page == "profile"){
      this._postService.getPostsByUser(this.user_id).subscribe(
        response=>{
          this.posts = response.posts;
        },
        error=>{
          console.log(error)
        }
      )
    }
  }
}
