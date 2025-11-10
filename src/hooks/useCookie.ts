import { useCookies } from "react-cookie";

export const useCookie = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const getAccessToken = () => cookies.token;

    const setAccessToken = (token: string) => {
        setCookie("token", token, {
            path: "/",
            maxAge: 86400,
            sameSite: "strict",
        });
    };

    const removeAccessToken = () => {
        removeCookie("token", { path: "/" });
    };

    return { getAccessToken, setAccessToken, removeAccessToken };
};
