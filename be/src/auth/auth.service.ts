import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../db/db.service';
import { hash, compare } from '../util/crypto';

@Injectable()
export class AuthService {
    constructor(
        private dbService: DbService,
        private jwtService: JwtService,
    ) {}

    async signup(email: string, password: string, name: string) {
        const existingUser = await this.dbService.db
            .collection('users')
            .findOne({ email });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hash(password);
        const user = {
            email,
            password: hashedPassword,
            name,
            createdAt: new Date(),
        };

        await this.dbService.db.collection('users').insertOne(user);

        const token = this.jwtService.sign({ email, name });
        return { token, user: { email, name } };
    }

    async signin(email: string, password: string) {
        const user = await this.dbService.db
            .collection('users')
            .findOne({ email });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = this.jwtService.sign({
            email: user.email,
            name: user.name,
        });
        return { token, user: { email: user.email, name: user.name } };
    }

    async validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            return payload;
        } catch {
            return null;
        }
    }
}
