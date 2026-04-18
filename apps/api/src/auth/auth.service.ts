import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async login(email: string, password: string, totpCode?: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) throw new UnauthorizedException("Invalid credentials");

    if (user.totpSecret) {
      const validTotp = totpCode && authenticator.check(totpCode, user.totpSecret);
      if (!validTotp) throw new UnauthorizedException("Two-factor code required");
    }

    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: payload
    };
  }
}
