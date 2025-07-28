import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{
    
    async login(){

        return "this is login"
    }
    
    async signup(){
        return "this is signup"
    }

    async logout(){
        return "this is logout"
    }
}