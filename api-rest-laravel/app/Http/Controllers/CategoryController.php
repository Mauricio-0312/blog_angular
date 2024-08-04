<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    function __construct(){
        $this->middleware("Api.Auth", ["except" => ["index", "show"]]);
    }
    public function index(){
        $categories = Category::all();

        $data = array(
            "status" => "success",
            "categories" => $categories,
            "code" => 200
        );

        return response()->json($data, $data["code"]);
    }

    public function show($id){
        $category = Category::find($id);

        if($category){
            $data = array(
                "status" => "success",
                "category" => $category,
                "code" => 200
             );
        }else{
            $data = array(
                "status" => "error",
                "message" => "No existe esa categoria",
                "code" => 200
            );
        }
        return response()->json($data, $data["code"]);
    }

    public function store(Request $request){
        //Get data
        $json = $request->input("json", null);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
             //Validate data
            $validate = \Validator::make($params_array, [
                "name" => "required"
            ]);

            if($validate->fails()){
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "Los datos no fueron enviados correctamente"
                );
            }else{
                //save data
                $category = new Category();
                $category->name = $params_array["name"];
                $category->save();
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "category" => $category
                );
            }
        }else{
            $data = array(
                "status" => "error",
                "code" => 404,
                "message" => "No has enviado ninguna categoria"
            );
        }
       

        return response()->json($data, $data["code"]);
    }

    public function update($id, Request $request){
        //Get data
        $json = $request->input("json", null);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
             //Validate data
            $validate = \Validator::make($params_array, [
                "name" => "required"
            ]);

            if($validate->fails()){
                $data = array(
                    "status" => "error",
                    "code" => 404,
                    "message" => "Los datos no fueron enviados correctamente"
                );
            }else{
                //update data
                Category::where("id", $id)->update($params_array);
                $data = array(
                    "status" => "success",
                    "code" => 200,
                    "category" => $params_array
                );
            }
        }else{
            $data = array(
                "status" => "error",
                "code" => 404,
                "message" => "No has enviado ninguna categoria"
            );
        }
       

        return response()->json($data, $data["code"]);
    }
}
