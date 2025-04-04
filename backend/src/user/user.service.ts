// backend/src/user/user.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'; // Import bcrypt

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // Inject User repository
    private userRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username }); // Tìm user theo username
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const { username, password } = registerDto;

    // 1. Kiểm tra xem username đã tồn tại chưa
    const existingUser = await this.findOneByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists'); // Nếu tồn tại, throw lỗi Conflict (409)
    }

    // 2. Hash password
    const saltRounds = 10; // Số vòng lặp salt (càng cao càng an toàn nhưng chậm hơn)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Tạo và lưu user mới
    const user = this.userRepository.create({
      username,
      password: hashedPassword, // Lưu password đã hash
    });

    await this.userRepository.save(user);

    // **Quan trọng:** Không trả về password trong response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user; // Bỏ trường password khỏi object trả về
    return userWithoutPassword as User;
  }
}