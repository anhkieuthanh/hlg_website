import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AuthModule } from "../auth/auth.module";
import { AuditService } from "../common/audit.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, AuditService, PrismaService]
})
export class AdminModule {}
