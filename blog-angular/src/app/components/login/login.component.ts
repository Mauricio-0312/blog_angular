import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: User;
  public token;
  public identity;
  public status;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {

    this.user = new User(1, "", "","","","","");

   }

  ngOnInit(): void {
    this.logout();
  }

  onSubmit(form){
    this._userService.signUp(this.user).subscribe(
      response =>{
        //Token
        if(response.status && response.status == "error"){
          this.status = "error";
        }else{
          this.token = response;
          this.status = "success";
          localStorage.setItem("token", this.token);
        }
          
      }, 
      error =>{
        console.log(error);
      }
    );

    

    this._userService.signUp(this.user, true).subscribe(
      response =>{
        //Object of user loggedin
        if(response.status && response.status == "error"){
          this.status = "error";
        }else{
          this.identity = response;          
          this.status = "success";
          localStorage.setItem("identity", JSON.stringify(this.identity));

          this._router.navigate(["/inicio"]);

        }
        
        console.log(this.status);
        

      }, 
      error =>{
        console.log(error);
      }
    );

    form.reset();

  }

  logout(){
    this._activatedRoute.params.subscribe(params => {
      let logout = +params.sure;
      if(logout== 1){
        localStorage.removeItem("identity");
        localStorage.removeItem("token");
        this._router.navigate(["/inicio"]);
      }
    })
  }
}
