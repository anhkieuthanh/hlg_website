import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LeadStatus, Role } from "@prisma/client";
import { JwtAuthGuard, Roles, RolesGuard } from "../auth/guards";
import { AuditService } from "../common/audit.service";
import { AdminService } from "./admin.service";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("admin")
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly audit: AuditService
  ) {}

  @Get("dashboard")
  @Roles(Role.SUPER_ADMIN, Role.CONTENT_EDITOR, Role.LEAD_MANAGER, Role.VIEWER)
  dashboard() {
    return this.service.dashboard();
  }

  @Get("leads")
  @Roles(Role.SUPER_ADMIN, Role.LEAD_MANAGER)
  leads(@Query("status") status?: LeadStatus) {
    return this.service.listLeads(status);
  }

  @Get("leads/export.csv")
  @Roles(Role.SUPER_ADMIN, Role.LEAD_MANAGER)
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", "attachment; filename=contact-leads.csv")
  exportLeads() {
    return this.service.exportLeadsCsv();
  }

  @Patch("leads/:id/status")
  @Roles(Role.SUPER_ADMIN, Role.LEAD_MANAGER)
  async updateLead(@Param("id") id: string, @Body("status") status: LeadStatus, @Req() request: any) {
    const lead = await this.service.updateLeadStatus(id, status);
    await this.audit.record({
      actorId: request.user?.sub,
      action: "lead.status.update",
      entityType: "ContactLead",
      entityId: id,
      metadata: { status },
      ipAddress: request.ip
    });
    return lead;
  }

  @Get("settings/:key")
  @Roles(Role.SUPER_ADMIN, Role.CONTENT_EDITOR, Role.VIEWER)
  setting(@Param("key") key: string) {
    return this.service.getSetting(key);
  }

  @Patch("settings/:key")
  @Roles(Role.SUPER_ADMIN, Role.CONTENT_EDITOR)
  async updateSetting(@Param("key") key: string, @Body("value") value: unknown, @Req() request: any) {
    const setting = await this.service.updateSetting(key, value);
    await this.audit.record({
      actorId: request.user?.sub,
      action: "settings.update",
      entityType: "SiteSetting",
      entityId: key,
      metadata: { key },
      ipAddress: request.ip
    });
    return setting;
  }

  @Get(":collection")
  @Roles(Role.SUPER_ADMIN, Role.CONTENT_EDITOR, Role.VIEWER)
  list(@Param("collection") collection: any) {
    return this.service.list(collection);
  }

  @Get(":collection/:id")
  @Roles(Role.SUPER_ADMIN, Role.CONTENT_EDITOR, Role.VIEWER)
  get(@Param("collection") collection: any, @Param("id") id: string) {
    return this.service.get(collection, id);
  }

  @Post(":collection")
  @Roles(Role.SUPER_ADMIN, Role.CONTENT_EDITOR)
  async create(@Param("collection") collection: any, @Body() body: Record<string, unknown>, @Req() request: any) {
    const record = await this.service.create(collection, body);
    await this.audit.record({
      actorId: request.user?.sub,
      action: `${collection}.create`,
      entityType: collection,
      entityId: record.id,
      ipAddress: request.ip
    });
    return record;
  }

  @Patch(":collection/:id")
  @Roles(Role.SUPER_ADMIN, Role.CONTENT_EDITOR)
  async update(
    @Param("collection") collection: any,
    @Param("id") id: string,
    @Body() body: Record<string, unknown>,
    @Req() request: any
  ) {
    const record = await this.service.update(collection, id, body);
    await this.audit.record({
      actorId: request.user?.sub,
      action: `${collection}.update`,
      entityType: collection,
      entityId: id,
      ipAddress: request.ip
    });
    return record;
  }

  @Delete(":collection/:id")
  @Roles(Role.SUPER_ADMIN, Role.CONTENT_EDITOR)
  async remove(@Param("collection") collection: any, @Param("id") id: string, @Req() request: any) {
    const record = await this.service.softDelete(collection, id);
    await this.audit.record({
      actorId: request.user?.sub,
      action: `${collection}.soft_delete`,
      entityType: collection,
      entityId: id,
      ipAddress: request.ip
    });
    return record;
  }
}
