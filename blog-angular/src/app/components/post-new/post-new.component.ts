import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { CategoryService } from "../../services/category.service";
import { UserService } from "../../services/user.service";
import { PostService } from "../../services/post/post.service";
import { global } from "../../global";

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit {
  public token: string;
  public status;
  public post: Post;
  public identity;
  public categories;
  public is_edit: boolean = false;

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
    private _postService: PostService

  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1,this.identity.sub, 1, "", "", "", "");
  }



  ngOnInit(): void {
    this.getCategories();
  }

  onSubmit(form){
    this._postService.postPost(this.token, this.post).subscribe(
      response=>{
          if(response.status == "success"){
            this.status = "success";
          }else{
            this.status = "error";
          }
      },
      error=>{
        console.log(error);
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
