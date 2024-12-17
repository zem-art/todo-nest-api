import { Global, Module } from "@nestjs/common";
import { AppProviders } from "./providers";

@Global()
@Module({
    // providers?: [...AppProviders],
    // exports: [...AppProviders]
})

export class SharedModule {}