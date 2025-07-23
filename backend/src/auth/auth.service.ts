import { Injectable } from "@nestjs/common";
import { AppwriteService } from "src/appwrite/appwrite.service";

@Injectable()
export class AuthService{
    constructor(private appwriteService:AppwriteService){}
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