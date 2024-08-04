import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { global } from "../global";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public url = global.url;

  constructor(
    public _http: HttpClient
  ) { }

  postCategory(token, category): Observable<any>{
    let json = JSON.stringify(category);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);

    return this._http.post(this.url+"category", params, {headers: headers});
  }

  getCategories(): Observable<any>{
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");

    return this._http.get(this.url+"category", {headers: headers});
  }

  getCategory(id): Observable<any>{
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");

    return this._http.get(this.url+"category/"+id, {headers: headers});
  }
}
