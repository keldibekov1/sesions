import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;

    const checkEmail = await this.prisma.user.findUnique({ where: { email } });
    if (checkEmail) {
      throw new BadRequestException("Email ro'yxatdan o'tilgan");
    }

    const hash = bcrypt.hashSync(password, 10);
    return await this.prisma.user.create({
      data: {
        ...registerUserDto,
        password: hash,
      },
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    let user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundException('User Topilmadi');
    }
    let match = bcrypt.compareSync(password, user.password);
    if (!match) {
      throw new BadRequestException('User Topilmadi');
    }
    let session = await this.prisma.session.findFirst({
      where: { ip: loginUserDto.ip, userId: user.id },
    });
    if (!session) {
      await this.prisma.session.create({
        data: { ip: loginUserDto.ip, userId: user.id },
      });
    }

    let token = this.jwtService.sign({ id: user.id, role: user.role });
    return { token };
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async sessions(req: any) {
    let id = req['user'].id;
    let session = await this.prisma.session.findMany({ where: { userId: id } });
    return { session };
  }

  async me(req: any) {
    let ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    let id = req['user'].id;

    let user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    let session = await this.prisma.session.findFirst({
      where: { ip: ip, userId: id },
    });

    if (!session) {
      throw new UnauthorizedException('Login qiling');
    }

    return user;
  }

  async deleteSession(req: any, id: number) {
    try {
      let deleted = await this.prisma.session.delete({
        where: { id: Number(id) },
      });
      return { data: deleted };
    } catch (error) {
      throw new NotFoundException('Session Topilmadi');
    }
  }
}