import axios, {AxiosResponse} from "axios";

export default class RestApi {

    private _endpoint;

    public constructor(endpoint) {
        this._endpoint = endpoint;
    }

    public async get(url: string, params = null): Promise<any> {
        const fullUrl = this._fullUrlFrom(url, params);
        const response = await axios.get(fullUrl);
        if (!RestApi.isSuccess(response))
            throw RestApi.error(url, response);
        return response.data;
    }

    private _fullUrlFrom(url: string, params: any): string {
        if (url[0] === "/") url = url.slice(1);
        if (!params) return `${this._endpoint}/${url}`;
        const queryString = RestApi._toQueryString(params);
        return `${this._endpoint}/${url}?${queryString}`;
    }

    private static _toQueryString(params): string {
        return Object
            .entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
    }

    private static isSuccess(response: AxiosResponse): boolean {
        return response.status >= 200 && response.status < 400;
    }

    private static error(url: string, response: AxiosResponse): Error {
        return new Error(`"${url}" returned with a status of ${response.status}`);
    }

}
