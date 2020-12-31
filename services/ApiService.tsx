import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChainQuestionnaire } from "../types/Chain/ChainQuestionnaire";
import { ChainStep } from "../types/Chain/ChainStep";
import { User } from "../types/User";
import { API_URL } from "@env";

export class ApiService {
	apiUrl = API_URL;
	endpoints = {
		login: `${this.apiUrl}/login_password`,
		resetPassword: `${this.apiUrl}/reset_password`,
		refreshSession: `${this.apiUrl}/session`,
		chainsForParticipant: `${this.apiUrl}/flow/skillstar/<participant_id>`,
		chain: `${this.apiUrl}/flow/skillstar/chain_questionnaire`,
		chainSession: `${this.apiUrl}/q/chain_questionnaire/<questionnaire_id>`,
		chainSteps: `${this.apiUrl}/chain_steps`,
	};

	constructor() {}

	async getChainSteps() {
		const url = this.endpoints.chainSteps;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			const dbData = await response.json();
			AsyncStorage.setItem("chainSteps", JSON.stringify(dbData));
			return dbData as ChainStep[];
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async getChainQuestionnaireId(participantId: number) {
		const url = this.endpoints.chainsForParticipant.replace(
			"<participant_id>",
			participantId.toString()
		);
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			const dbData = await response.json();
			if (
				dbData &&
				dbData.hasOwnProperty("steps") &&
				dbData.steps &&
				dbData.steps.length > 0
			) {
				const questionnaireId = dbData.steps[0].questionnaire_id;
				AsyncStorage.setItem("chainQuestionnaireId", questionnaireId);
				return questionnaireId;
			}
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async getChainData() {
		const url = this.endpoints.chain;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			const dbData = await response.json();
			AsyncStorage.setItem("chainQuestionnaireId", dbData.id);
			return dbData as ChainQuestionnaire;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async addChainData(data: ChainQuestionnaire) {
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
			AsyncStorage.setItem("chainQuestionnaireId", dbData.id);
			return dbData as ChainQuestionnaire;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async editChainData(data: ChainQuestionnaire, questionnaireId: number) {
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
			return dbData as ChainQuestionnaire;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async deleteChainData(data: ChainQuestionnaire, participantId: number) {
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
			return dbData as ChainQuestionnaire;
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
			console.log("url", url);

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
				console.log("user.token", user.token);
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

	// async addChainData(data): Promise<void> {
	// }
}
