import { Global, Module } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { AppwriteService } from "./appwrite.service";

@Global()
@Module({
    providers:[AppwriteService],
    exports:[AppwriteService]
})
export class AppwriteModule{}