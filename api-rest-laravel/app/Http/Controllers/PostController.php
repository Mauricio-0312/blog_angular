<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Models\Post;


class PostController extends Controller
{
    function __construct(){
        $this->middleware("Api.Auth", 
        ["except" => ["index", "show", "getImage", "getPostsByUser", "getPostsByCategory"]
        ]);
    }
    public function index(){
        $posts = Post::all()->load("category");

        $data = array(
            "status" => "success",
            "posts" => $posts,
            "code" => 200
        );

        return response()->json($data, $data["code"]);
    }

    public function show($id){
        $post = Post::find($id);
        
        if(is_object($post)){
            $data = array(
                "status" => "success",
                "post" => $post->load("category")->load("user"),
                "code" => 200
             );
        }else{
            $data = array(
                "status" => "error",
                "message" => "No existe ese post",
                "code" => 400
            );
        }
        return response()->json($data, $data["code"]);
    }

    public function store(Request $request){
        //Get data
        $json = $request->input("json", null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
            
            $jwt = new \JwtAuth();
            $token = $request->header("Authorization");
            $user = $jwt->checkToken($token, true);
             //Validate data
             $validate = \Validator::make($params_array, [
                "title" => "required",
                "content" => "required",
                "category_id" => "required",
                "image" => "required",

            ]);

            if($validate->fails()){
                $data = array(
                    "status" => "error",
                    "message" => "No se enviaron los datos correctamente",
                    "code" => 400
                );
            }else{
                $post = new Post();
                $post->user_id = $user->sub;
                $post->category_id = $params->category_id;
                $post->content = $params->content;
                $post->title = $params->title;
                $post->image = $params->image;
                $post->save();

                $data = array(
                    "status" => "success",
                    "post" => $post,
                    "code" => 200
                );
            }
        }else{
            $data = array(
                "status" => "error",
                "message" => "No enviaste ningun post",
                "code" => 400
            );
        }

        return response()->json($data, $data["code"]);
    }

    public function update($id, Request $request){
        //Get data
        $json = $request->input("json", null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        $user = $this->getUserLoggedIn($request);


        if(!empty($params_array)){
            
             //Validate data
             $validate = \Validator::make($params_array, [
                "title" => "required",
                "content" => "required",
                "category_id" => "required",
                "image" => "required",

            ]);

            if($validate->fails()){
                $data = array(
                    "status" => "error",
                    "message" => "No envio los datos correctamente",
                    "code" => 400
                );
            }else{
                $post = Post::where("id", $id)->where("user_id", $user->sub)->first();

                if(!empty($post)){
                    $post->update($params_array);
                    $post_updated = \DB::table("posts")->where("id", $id)->get();

                    $data = array(
                    "status" => "success",
                    "changes" => $params_array,
                    "post" => $post_updated,
                    "code" => 200
                    );
                }else{
                    $data = array(
                        "status" => "error",
                        "code" => 400,
                        "message" => "Este post no existe o no fue creado por usted"
                        );
                }
                
            }
        }else{
            $data = array(
                "status" => "error",
                "message" => "No enviaste nada para actualizar",
                "code" => 400
            );
        }

        return response()->json($data, $data["code"]);
    }

    public function destroy($id, Request $request){
        //Get user logged in
        $user = $this->getUserLoggedIn($request);

        //Check if post exists
        $post = Post::where("id", $id)->where("user_id", $user->sub)->first();

        if(is_object($post)){

            //Delete post
            $post->delete();
            $data = array(
                "status" => "success",
                "message" => "Post eliminado correctamente",
                "code" => 200
            );
        }else{

            //Error
            $data = array(
                "status" => "error",
                "message" => "No existe este post o no es tuyo",
                "code" => 400
            );
        }

        return response()->json($data, $data["code"]);

    }

    public function uploadImage(Request $request){
        //Get image
        $file = $request->file("file0");

        if(!empty($file)){
            //Save image
            $filename = time().$file->getClientOriginalName();
            \Storage::disk("images")->put($filename, \File::get($file));

            $data = array(
                "status" => "success",
                "code" => 200,
                "filename" => $filename
            );
        }else{

            //Error
            $data = array(
                "status" => "error",
                "message" => "Error al subir la foto",
                "code" => 400
            );
        }

        return response()->json($data, $data["code"]);
    }

    public function getImage($name){
        //Check if that image exists
        $isset = \Storage::disk("images")->exists($name);

        if($isset){
            //Get image
            $file = \Storage::disk("images")->get($name);

            //Return image
            return new Response($file, 200);
        }else{
            //Error
            $data = array(
                "status" => "error",
                "message" => "La imagen no existe",
                "code" => 400
            );

            //Throw error
            return response()->json($data, $data["code"]);
        }
    }

    public function getPostsByCategory($id){
        $posts = Post::where("category_id", $id)->get();

        return response()->json([
            "status" => "success",
            "posts" => $posts
        ], 200);

    }

    public function getPostsByUser($id){
        $posts = Post::where("user_id", $id)->get();

        return response()->json([
            "status" => "success",
            "posts" => $posts
        ], 200);

    }

    public function getUserLoggedIn($request){
        $jwt = new \JwtAuth();
        $token = $request->header("Authorization");
        $user = $jwt->checkToken($token, true);
        return $user;
    }
}
