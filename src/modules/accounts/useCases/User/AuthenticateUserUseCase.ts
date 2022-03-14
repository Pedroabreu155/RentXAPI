import { inject, injectable } from "tsyringe";
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { IUsersRepository } from "../../repositories/user/interfaces";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {

  constructor(@inject("UsersRepository") private usersRepository: IUsersRepository) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if(!user) {
      throw new Error("Invalid credentials!")
    }

    const hasCorrectPassword = await compare(password, user.password)

    if(!hasCorrectPassword) {
      throw new Error("Invalid credentials!")
    }

    const token = sign({}, "aksjdasiodjsdçasjdiasda564645644", {
      subject: user.id,
      expiresIn: "1d"
    })

    const responseBody: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      }
    };

    return responseBody;

  }
}
