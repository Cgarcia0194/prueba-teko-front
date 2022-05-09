import { api } from "@/helpers/api";
import auth from '@/helpers/auth';

export function requests() {

    const { logout } = auth();

    async function send(url, params) {
        try {
            const { data } = await api.post(url, params, {
                responseType: "json"
            });

            if (data.reauth) {
                logout();
            }

            return {
                data
            };
        } catch (err) {
            return {
                data: null
            };
        }
    }

    return { send };
}