<?php

namespace App\Http\Controllers;
use App\Models\User;


use Illuminate\Http\Request;
use Illuminate\Http\Response;


class UserController extends Controller
{
    public function register(Request $request){

        //Get data
        $json = $request->input("json", null);
        $params = json_decode($json); //Object
        $params_array = json_decode($json, true); //array

        if(!empty($params) && !empty($params_array)){

            //Valid data
            $validate = \Validator::make($params_array, [
                "name" => "required|alpha",
                "surname" => "required|alpha",
                "email" => "required|email|unique:users",
                "password" => "required"

            ]);
            
            if($validate->fails()){
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "El usuario no se ha creado",
                    "errors" => $validate->errors()

                );
            }else{
                //Encrypt password and assign data
                $password_encrypted = hash("sha256", $params->password);

                $user = new User();

                $user->name = $params_array["name"];
                $user->surname = $params_array["surname"];
                $user->email = $params_array["email"];
                $user->password = $password_encrypted;
                $user->role = "ROLE_USER";

                //save user
                $user->save();

                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "El usuario se ha creado correctamente",
                    "user" => $user
                );
            }

        }else{
            $data = array(
                "status" => "error",
                "code" => 404,
                "message" => "Los datos enviados no son correctos"
              
            );
        }

        return response()->json($data, $data["code"]);

    } 

    public function login(Request $request){
        $jwt = new \JwtAuth();

        //Get data
        $json = $request->input("json");
        $params = json_decode($json); //Object
        $params_array = json_decode($json, true); //array

        if(!empty($params) && !empty($params_array)){

            //Valid data
            $validate = \Validator::make($params_array, [
                "email" => "required|email",
                "password" => "required"

            ]);
            
            if($validate->fails()){
                $signup = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "El usuario no se ha logeado",
                    "errors" => $validate->errors()

                );
            }else{
                $password_encrypted = hash("sha256", $params->password);

                $signup = $jwt->signup($params->email, $password_encrypted);

                if(!empty($params->gettoken)){
                    $signup = $jwt->signup($params->email, $password_encrypted, true);
                }
            }

            
        }
        return response()->json($signup, 200);
    }

    public function update(Request $request){

        //Check token
        $token = $request->header("Authorization");
        $jwt = new \JwtAuth();
        $token_checked = $jwt->checkToken($token);
        $user = $jwt->checkToken($token, true);
        
        //Get new data
        $json = $request->input("json");

        if($token_checked && !empty($json)){
            
            $params_array = json_decode($json, true);

            //verify the data gotten up
            $validate = \Validator::make($params_array, [
                "name" => "required",
                "surname" => "required",
                "email" => "required|email"
            ]);
            
            if($validate->fails()){
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "Los datos enviados no son correctos"
                );
            }else{
                //Save on Database
                User::where("id", $user->sub)->update($params_array);
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "message" => "El usuario fue actualizado exitosamente",
                    "user" => $user,
                    "change" => $params_array
                );
            }
           
        }
        else{
            $data = array(
                "status" => "error",
                "code" => 404,
                "message" => "No se enviaron los datos para actualizar"
            );
        }

        return response()->json($data, $data["code"]);
    }

    public function upload(Request $request){
        //get Image
        $image = $request->file("file0");

        //Verify image
        $validate = \Validator::make($request->all(), [
            "file0" => "required|image|mimes:jpg,jpeg,png,gif"
        ]);
        
        //save image
        if($image && !$validate->fails()){
            $image_name = time().$image->getClientOriginalName();
            \Storage::disk("users")->put($image_name, \File::get($image));
            $data = array(
                "status" => "success",
                "code" => 200,
                "message" => "Imagen guardada exitosamente",
                "image_name" => $image_name 
            );
        }else{
            $data = array(
                "status" => "error",
                "code" => 404,
                "message" => "Imagen no enviada"
            );
        }

        return response()->json($data, $data["code"]);
    }

    public function getImage($filename){
        $exists = \Storage::disk("users")->exists($filename);

        if($exists){
            $file = \Storage::disk("users")->get($filename);
            return new Response($file, 200);
        }
        else{
            $data = array(
                "status" => "error",
                "code" => 404,
                "message" => "La imagen no existe"
            );
            return response()->json($data, $data["code"]);
        }
    }

    public function getPerfil($id){
        $user = User::find($id);

        if(is_object($user)){
            $data = array(
                "status" => "success",
                "code" => 200,
                "user" => $user
            );
        }else{
            $data = array(
                "status" => "error",
                "code" => 404,
                "message" => "El usuario no existe"
            );
        }

        return response()->json($data, $data["code"]);
    }
}
