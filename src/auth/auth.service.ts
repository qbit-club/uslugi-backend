import { Injectable } from '@nestjs/common'
import { TokenService } from 'src/token/token.service'
import { Model } from 'mongoose'
import ApiError from 'src/exceptions/errors/api-error'
import { InjectModel } from '@nestjs/mongoose'
import { UserClass } from 'src/user/schemas/user.schema'
import { User } from 'src/user/interfaces/user.interface'
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface'
import { RolesService } from 'src/roles/roles.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private TokenService: TokenService,
    private RolesService: RolesService
  ) { }

  async registration(user: User | UserFromClient) {
    const candidate = await this.UserModel.findOne({ email: user.email })

    if (candidate)
      throw ApiError.BadRequest(`Пользователь с почтой ${user.email} уже существует`)

    if (user.password.length < 8)
      throw ApiError.BadRequest('Слишком короткий пароль')

    const password = await bcrypt.hash(user.password, 3)
    const created_user = (await this.UserModel.create(Object.assign(user, { password }))).toObject()

    const tokens = this.TokenService.generateTokens(created_user)
    await this.TokenService.saveToken(tokens.refreshToken)

    return {
      ...tokens,
      user: created_user
    }
  }

  async login(email: string, password: string) {
    const user = (await this.UserModel.findOne({ email })).toObject()

    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден')
    }

    if (user.password.length < 8)
      throw ApiError.BadRequest('Слишком короткий пароль')

    const isPassEquals = await bcrypt.compare(password, user.password)

    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }

    const tokens = this.TokenService.generateTokens(user)
    await this.TokenService.saveToken(tokens.refreshToken)

    return {
      ...tokens,
      user
    }
  }

  async refresh(refreshToken: string, accessToken: string) {
    let userData: any; // jwt payload
    let user: any; // object to return
    
    // проверить, валиден ли ещё accessToken
    userData = this.TokenService.validateAccessToken(accessToken)
    
    if (userData != null) {
      user = (await this.UserModel.findById(userData._id)).toObject()
      
      return {
        refreshToken: refreshToken,
        accessToken: accessToken,
        user: user
      }
    }
    // если accessToken не валиден - пройти авторизацию с refreshToken и создать новый accessToken

    // если нет refreshToken выкидываем пользователя
    if (!refreshToken) {      
      throw ApiError.UnauthorizedError()
    }

    userData = this.TokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await this.TokenService.findToken(refreshToken)
    // если refreshToken сдох, то выкидываем пользователя
    if (!userData || !tokenFromDb) {    
      throw ApiError.UnauthorizedError()
    }

    user = (await this.UserModel.findById(userData._id)).toObject()

    if (userData.password !== user.password) {      
      throw ApiError.AccessDenied('Аутентификация провалена. Пароль изменен')
    }
    // new accessToken, чтобы пользователь мог зайти в
    // систему ближайшие 15 минут без использоватния refreshToken
    const newAccessToken = this.TokenService.generateAccessToken(user)

    return {
      refreshToken: refreshToken,
      accessToken: newAccessToken,
      user: user
    }
  }

  async resetPassword(password: string, token: string, user_id: any) {
    try {
      await this.validateEnterToResetPassword(user_id, token)

      const hashPassword = await bcrypt.hash(password, 3)
      const user = await this.UserModel.findByIdAndUpdate(user_id, { password: hashPassword })

      const tokens = this.TokenService.generateTokens(user)
      await this.TokenService.saveToken(tokens.refreshToken)

      return {
        ...tokens,
        user: user
      }
    } catch (error) {
      return null
    }
  }

  async validateEnterToResetPassword(user_id: any, token: string) {
    let candidate = await this.UserModel.findById(user_id)
    if (!candidate) throw ApiError.BadRequest('Пользователь с таким _id не найден')

    let secret = process.env.JWT_RESET_SECRET + candidate.password
    let result = this.TokenService.validateResetToken(token, secret)

    if (!result) throw ApiError.AccessDenied()

    return result
  }

  async sendResetLink(email: string) {
    let candidate = await this.UserModel.findOne({ email })
    if (!candidate)
      throw ApiError.BadRequest('Пользователь с таким email не найден')

    const secret = process.env.JWT_RESET_SECRET + candidate.password
    const token = this.TokenService.createResetToken(candidate, secret)

    const link = process.env.CLIENT_URL + `/forgot-password?user_id=${candidate._id}&token=${token}`

    //sendMail({ link: link }, 'reset-password.hbs', [candidate.email], 'single')

    return link
  }

  async logout(refreshToken: string) {
    return await this.TokenService.removeToken(refreshToken)
  }

  async update(new_user: UserFromClient, user: UserFromClient) {
    return await this.UserModel.findByIdAndUpdate(user._id, new_user, {
      new: true,
      runValidators: true
    })
  }
}
