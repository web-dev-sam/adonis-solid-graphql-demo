import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export interface SignupInput {
  fullName?: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export interface LoginInput {
  email: string
  password: string
}

export default class AuthService {
  async signup(input: SignupInput, auth: HttpContext['auth']) {
    const payload = await signupValidator.validate(input)
    const user = await User.create(payload)
    await auth.use('web').login(user)
    return user
  }

  async login(input: LoginInput, auth: HttpContext['auth']) {
    const user = await User.verifyCredentials(input.email, input.password)
    await auth.use('web').login(user)
    return user
  }

  async logout(auth: HttpContext['auth']) {
    await auth.use('web').logout()
  }
}
