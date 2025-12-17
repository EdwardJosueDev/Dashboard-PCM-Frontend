export class LocalStorageService
{
	static getToken = (): string | null => {
		return localStorage.getItem('access_token');
	};

	static setAuthToken = (token: string | null) => {
		if (token) {
			localStorage.setItem('access_token', token);
		} else {
			localStorage.removeItem('access_token');
		}
	};
	static clear()
	{
		localStorage.clear()
	}
}