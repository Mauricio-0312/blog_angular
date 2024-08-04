<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header("Authorization");
        $jwt = new \JwtAuth();
        $token_checked = $jwt->checkToken($token);

        if($token_checked){
            return $next($request);
        }
        else{
            $data = array(
                "status" => "error",
                "code" => 404,
                "message" => "El usuario no esta identificado"
            );

            return response()->json($data, $data["code"]);
        }
    }
}
