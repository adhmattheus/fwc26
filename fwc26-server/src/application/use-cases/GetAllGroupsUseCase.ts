import { IGroupRepository } from "../../domain/repositories/IGroupRepository";

export class GetAllGroupsUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute() {
    return this.groupRepository.findAll();
  }
}
