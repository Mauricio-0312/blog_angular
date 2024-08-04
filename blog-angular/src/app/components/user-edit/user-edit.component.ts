import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { global } from "../../global";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public user: User;
  public status: string;
  public token;
  public identity;
  public url;
  public is_edit: boolean = false;

    //Froala text options
  public options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
  };

  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.jpeg,.gif",
    maxSize: "50",
    uploadAPI:  {
      url: global.url+"upload",
      method:"POST",
      headers: {
     "Authorization" : this._userService.getToken()
      },
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Sube tu avatar de usuario"
    
};


  constructor(
    private _userService: UserService

  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.user = new User(this.identity.sub, 
                          this.identity.name, 
                          this.identity.surname, 
                          this.identity.email,
                          this.identity.password, 
                          this.identity.description,
                          this.identity.image);
    
    this.url = global.url;
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._userService.update(this.token, this.user).subscribe(
      response => {
        console.log(response);
        //Modify the user identity stored on localStorage
        if(response.change.name){
            this.identity.name = response.change.name;
        }
        if(response.change.surname){
          this.identity.surname = response.change.surname;
        }
        if(response.change.email){
          this.identity.email = response.change.email;
        }
        if(response.change.description){
          this.identity.description = response.change.description;
        }
        if(response.change.image){
          this.identity.image = response.change.image;
        }
        localStorage.setItem("identity", JSON.stringify(this.identity));
        
        this.identity = this._userService.getIdentity();

      }, 
      error => {
        console.log(error);
      }
    );
  }

  AvatarUpload(data){
    let response = JSON.parse(data.response);
    this.user.image = response.image_name;
  }

}
