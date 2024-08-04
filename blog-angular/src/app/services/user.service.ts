import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';

import { global } from "../global";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url: string;
  
  constructor(
    public _http: HttpClient
  ) {
    this.url = global.url;
   }

  register(user): Observable<any>{
    let json = JSON.stringify(user);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");

    return this._http.post(this.url+"register", params, {headers: headers});
  }

  signUp(user, gettoken = null): Observable<any>{
    if(gettoken){
      user.gettoken = true;
    }
    let json = JSON.stringify(user);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");

    return this._http.post(this.url+"login", params, {headers: headers});
  }

  getToken(){
    let token = localStorage.getItem("token");

    if(token && token == "undefined"){
      
      token = null;

    }
    return token;

  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem("identity"));

    if(identity && identity == "undefined"){
      
      identity = null;

    }

    return identity;
  }

  update(token, user): Observable<any>{
    let json = JSON.stringify(user);
    let params = "json="+json;

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token)
                                    ;

    return this._http.put(this.url+"update", params, {headers: headers});
  }

  getUser(token, id): Observable<any>{

    let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
                                    .set("Authorization", token)
                                    ;

    return this._http.get(this.url+"getUser/"+id, {headers: headers});
  }
}
