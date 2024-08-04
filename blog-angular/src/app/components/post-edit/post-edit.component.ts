import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { CategoryService } from "../../services/category.service";
import { UserService } from "../../services/user.service";
import { PostService } from "../../services/post/post.service";
import { global } from "../../global";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { unescapeIdentifier } from '@angular/compiler';

@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  public id;
  public token: string;
  public status;
  public post: Post;
  public identity;
  public categories;
  public is_edit: boolean = true;
  public url;

  //Froala text options
    public options: Object = {
      charCounterCount: true,
      toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    };
  
    //angular-file-uploader config
    public afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.png,.jpeg,.gif",
      maxSize: "50",
      uploadAPI:  {
        url: global.url+"post/uploadImage",
        method:"POST",
        headers: {
       "Authorization" : this._userService.getToken()
        },
      },
      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: false,
      attachPinText: "Sube la imagen"
      
    };

  constructor(
    private _categoryService: CategoryService,
    private _userService: UserService,
    private _postService: PostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this.post = new Post(1, 1, 1,"","","", "");
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.url = global.url;
   }

  ngOnInit(): void {
    this.getCategories();

    this._activatedRoute.params.subscribe(
      params=>{
        this.id = params.id;
        this._postService.getPost(this.id).subscribe(
          response=>{
              
              delete(response.post.category);
              delete(response.post.user);

              console.log(response.post);

              this.post = response.post;
              if(this.post.user_id != this.identity.sub){
                this._router.navigate(["/inicio"]);
              }
          },
          error=>{

          }
        );
      }
    )
  }

  onSubmit(form){
    this._postService.updatePost(this.token, this.post, this.id).subscribe(
      response=>{
        if(response.status == "success"){
          this.status = "success"
          this._router.navigate(["/post/detail/"+this.id])
        }
      },
      error=>{
        console.log(error);
        this.status = "error";
      }
    )
  }

  PostImageUpload(data){
    let response = JSON.parse(data.response);
    this.post.image = response.filename;
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response=>{
        this.categories = response.categories;
      },
      error=>{
        console.log(this.categories);
      }
    )
  }

}
