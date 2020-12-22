import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/User";
import { API_URL } from "@env";


export class ApiService {
	apiUrl = API_URL;
	endpoints = {
		login: `${this.apiUrl}/login_password`,
		resetPassword: `${this.apiUrl}/reset_password`,
		refreshSession: `${this.apiUrl}/session`,
		chain: `${this.apiUrl}/flow/skillstar/chain_questionnaire`,
		chainSession: `${this.apiUrl}/q/chain_questionnaire/<questionnaire_id>`,
	};

	constructor() {}

	async addBaselineAssessment(data: BaselineAssessmentData) {
		const url = this.endpoints.chain;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const dbData = await response.json();
			AsyncStorage.setItem("baselineAssessmentId", dbData.id);
			return dbData as BaselineAssessmentData;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async editBaselineAssessment(
		data: BaselineAssessmentData,
		questionnaireId: number
	) {
		const url = this.endpoints.chain + "/" + questionnaireId;
		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const dbData = await response.json();
			return dbData as BaselineAssessmentData;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async deleteBaselineAssessment(
		data: BaselineAssessmentData,
		participantId: number
	) {
		const url = this.endpoints.chain + "/" + participantId;
		try {
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const dbData = await response.json();
			return dbData as BaselineAssessmentData;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async login(
		email: string,
		password: string,
		email_token = ""
	): Promise<User | null> {
		try {
			const url = this.endpoints.login;
			console.log('url', url);

			const response = await fetch(this.endpoints.login, {
				method: "POST",
				mode: "cors",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password, email_token }),
			});

			const user: User = await response.json();

			if (user.token) {
				console.log('user.token', user.token);
				await AsyncStorage.setItem("user_token", user.token);
				await AsyncStorage.setItem("user", JSON.stringify(user));
				return user;
			} else {
				return null;
			}
		} catch (e) {
			console.error("Login error:");
			console.error(e);
			return null;
		}
	}

	async logout(): Promise<void> {
		await AsyncStorage.removeItem("user_token");
		return AsyncStorage.removeItem("user");
	}

	// async addBaselineAssessment(data): Promise<void> {
	// }
}
