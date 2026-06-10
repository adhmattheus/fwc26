import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { AppError } from "../../shared/errors/AppError";

export class GetMeUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
