import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import {global} from "../../global";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private _http: HttpClient
  ) { }

  postPost(token, post): Observable<any>{
    let json = JSON.stringify(post);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);
            
    return this._http.post(global.url+"post", params, {headers: headers});
  }

  getPosts(): Observable<any>{
   
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
            
    return this._http.get(global.url+"post", {headers: headers});
  }

  getPost(id): Observable<any>{
   
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
            
    return this._http.get(global.url+"post/"+id, {headers: headers});
  }

  updatePost(token, post, id): Observable<any>{
    let json = JSON.stringify(post);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);
            
    return this._http.put(global.url+"post/"+ id, params, {headers: headers});
  }

  deletePost(token, id): Observable<any>{
   
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token);
            
    return this._http.delete(global.url+"post/"+ id, {headers: headers});
  }

  getPostsByCategory(id): Observable<any>{
   
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
            
    return this._http.get(global.url+"post/category/"+id, {headers: headers});
  }

  getPostsByUser(id): Observable<any>{
   
    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
            
    return this._http.get(global.url+"post/user/"+id, {headers: headers});
  }
}
