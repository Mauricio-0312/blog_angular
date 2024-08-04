<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class JwtAuth {
    
    public $key;
    function __construct(){
        $this->key = "this_is_my_super_secured_Key_0978909817712";
    }

    public function signup($email, $password, $gettoken = null){

        //Find user
        $user = User::where([
            "email" => $email,
            "password" => $password
        ])->first();

        $signup = false;

        if(is_object($user)){
            //Create token
            $signup = true;
            $token = array(
                "sub" => $user->id,
                "email" => $user->email,
                "name" => $user->name,
                "surname" => $user->surname,
                "image" => $user->image,
                "description" => $user->description,
                "iat" => time(),
                "exp" => time() + (7 * 24 * 60 * 60)
            );

            //Encode token
            $jwt = JWT::encode($token, $this->key, "HS256");
            
            //Decode token
            $decode = JWT::decode($jwt, $this->key, ["HS256"]);

            //Verify what kind of data must be sent
            if(is_null($gettoken)){
                $data = $jwt;
            }else{
                $data = $decode;
            }

        }else{
            //error
            $data = array(
                "status" => "error",
                "message" => "login incorrecto"
            );
        }

        return $data;
    }

    public function checkToken($jwt, $gettoken = false){
        $auth = false;

        try{
            $jwt = str_replace('"', '', $jwt);
            $decoded = JWT::decode($jwt, $this->key, ["HS256"]);
        }
        catch(\UnexpectedValueException $e){
            $auth = false;

        }
        catch(\DomainException $e){
            $auth = false;

        }

        if(!empty($decoded) && is_object($decoded) && isset($decoded->sub)){
            $auth = true;
        }else{
            $auth = false;
        }

        if($gettoken){
            return $decoded;
        }

        return $auth;
    }
}

?>