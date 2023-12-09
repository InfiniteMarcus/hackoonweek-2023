import { Collection } from 'discord.js';
import crypto from 'crypto';

import { UserPasswords, UserPassword } from '../types';

const cryptoAlgorithm = 'aes256';
const iv = Buffer.alloc(16, 0);
const passwords = new Collection<string, UserPasswords[]>();

export function getUserPasswordsInServer(serverId: string, userId: string) {
	const usersPasswords = passwords.get(serverId);

	if (!usersPasswords) {
		return null;
	}

	const userPasswords = usersPasswords.find(userPwds => userPwds.userId === userId);

	if (!userPasswords) {
		return null;
	}

	return userPasswords;
}

export function getUserPasswordByPasswordName(serverId: string, userId: string, passwordName: string) {
	const userPasswords = getUserPasswordsInServer(serverId, userId);

	if (!userPasswords) {
		return null;
	}

	const password = userPasswords.passwords.find(pwd => pwd.name === passwordName);

	if (!password) {
		return null;
	}

	const secret = String(process.env.ENCRYPTION_SECRET);
	const decipher = crypto.createDecipheriv(cryptoAlgorithm, secret, iv);
	const decryptedPassword = decipher.update(password.password, 'hex', 'utf8') + decipher.final('utf8');

	return decryptedPassword;
}

export function createUsersPasswordsInServer(serverId: string) {
	return passwords.set(serverId, [] as UserPasswords[]);
}

export function createUserPasswordsInServer(serverId: string, userId: string) {
	let usersPasswords = passwords.get(serverId);

	if (!usersPasswords) {
		createUsersPasswordsInServer(serverId);
		usersPasswords = passwords.get(serverId);

		if (!usersPasswords) {
			return false;
		}
	}

	const userPasswords = usersPasswords.find(pwds => pwds.userId === userId);

	if (!userPasswords) {
		usersPasswords.push({
			userId,
			passwords: [],
		});
		return true;
	}

	return true;
}

export function insertPasswordInServer(serverId: string, userId: string, password: UserPassword) {
	let userPasswords = getUserPasswordsInServer(serverId, userId);

	if (!userPasswords) {
		createUserPasswordsInServer(serverId, userId);
	}

	userPasswords = getUserPasswordsInServer(serverId, userId);

	if (!userPasswords) {
		return false;
	}

	const secret = String(process.env.ENCRYPTION_SECRET);
	const cipher = crypto.createCipheriv(cryptoAlgorithm, secret, iv);
	const encryptedPassword = cipher.update(password.password, 'utf8', 'hex') + cipher.final('hex');

	userPasswords.passwords.push({
		name: password.name,
		password: encryptedPassword,
	});

	console.log(`SENHA ENCRIPTADA: ${encryptedPassword}`);

	return true;
}

export function deletePasswordInServer(serverId: string, userId: string, passwordName: string) {
	const userPasswords = getUserPasswordsInServer(serverId, userId);

	if (!userPasswords) {
		return true;
	}

	userPasswords.passwords = userPasswords.passwords.filter(password => password.name !== passwordName);

	return true;
}

export function getUserSavedPasswordServers(userId: string) {
	const userServers = passwords.filter(pwds => pwds.find(userPasswords => userPasswords.userId === userId)).map((pwds, serverId) => {
		const totalPasswords = pwds.find(userPasswords => userPasswords.userId === userId)?.passwords.length;

		return {
			serverId,
			totalPasswords,
		};
	});

	return userServers;
}

export function changeMasterPassword(userId: string, masterPassword: string) {
	const secret = String(process.env.ENCRYPTION_SECRET);
	const cipher = crypto.createCipheriv(cryptoAlgorithm, secret, iv);
	const encryptedMasterPassword = cipher.update(masterPassword, 'utf8', 'hex') + cipher.final('hex');
	console.log(encryptedMasterPassword);
	return true;
}
