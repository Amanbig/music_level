import { Module } from "@nestjs/common";
import { AppwriteModule } from "src/appwrite/appwrite.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports:[AppwriteModule],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule{}