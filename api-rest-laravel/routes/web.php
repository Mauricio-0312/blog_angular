<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get("api/hola", "PruebasController@index");
Route::post("/api/register", "UserController@register");
Route::post("/api/login", "UserController@login");
Route::put("/api/update", "UserController@update");
Route::post("/api/upload", "UserController@upload")->middleware("Api.Auth");
Route::get("/api/getImage/{filename}", "UserController@getImage");
Route::get("/api/getUser/{id}", "UserController@getPerfil");

Route::resource("/api/category", "CategoryController");

Route::resource("/api/post", "PostController");

Route::post("/api/post/uploadImage", "PostController@uploadImage");
Route::get("/api/post/getImage/{name}", "PostController@getImage");
Route::get("/api/post/category/{id}", "PostController@getPostsByCategory");
Route::get("/api/post/user/{id}", "PostController@getPostsByUser");
