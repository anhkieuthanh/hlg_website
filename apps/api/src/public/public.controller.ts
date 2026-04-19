import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PublicService } from "./public.service";

@ApiTags("public")
@Controller("public")
export class PublicController {
  constructor(private readonly service: PublicService) {}

  @Get("home")
  home(@Query("locale") locale?: string) {
    return this.service.home(locale);
  }

  @Get("site")
  site(@Query("locale") locale?: string) {
    return this.service.site(locale);
  }

  @Get("projects")
  projects(@Query("locale") locale?: string) {
    return this.service.listProjects(locale);
  }

  @Get("projects/:slug")
  project(@Param("slug") slug: string, @Query("locale") locale?: string) {
    return this.service.project(locale, slug);
  }

  @Get("catalogue")
  catalogue(@Query("locale") locale?: string) {
    return this.service.catalogue(locale);
  }

  @Get("news")
  news(@Query("locale") locale?: string) {
    return this.service.news(locale);
  }

  @Get("news/:slug")
  newsArticle(@Param("slug") slug: string, @Query("locale") locale?: string) {
    return this.service.newsArticle(locale, slug);
  }

  @Get("capabilities")
  capabilities(@Query("locale") locale?: string) {
    return this.service.capabilities(locale);
  }

  @Post("leads")
  submitLead(@Body() body: { name: string; email: string; phone?: string; company?: string; message: string }) {
    return this.service.submitLead(body);
  }
}
