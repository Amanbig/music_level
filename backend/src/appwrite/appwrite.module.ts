import { Global, Module } from "@nestjs/common";
import { AppwriteService } from "./appwrite.service";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        AppwriteService
    ],
    exports: [
        AppwriteService
    ]
})
export class AppwriteModule {}