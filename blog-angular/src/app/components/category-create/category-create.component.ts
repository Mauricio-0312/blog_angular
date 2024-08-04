import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryService } from "../../services/category.service";
import { UserService } from "../../services/user.service";


@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css'],
  providers: [CategoryService, UserService]
})
export class CategoryCreateComponent implements OnInit {
  public category: Category;
  public token;
  public status;

  constructor(
    private _categoryService: CategoryService,
    private _userService: UserService

  ) { 
    this.category = new Category(1, "");
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._categoryService.postCategory(this.token, this.category).subscribe(
      response =>{

        console.log(response);
        this.status = "success";

      }, error=>{

        console.log(error);
        this.status = "error";

      }
    )
  }

}
