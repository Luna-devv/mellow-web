import { useEffect, useRef, useState } from "react";

import { GT4Init } from "@/lib/gt4";

export enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

export function useCaptcha(path: string, userId?: string) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const button = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!userId) return;
        const { init } = GT4Init();

        init(
            {
                captchaId: process.env.NEXT_PUBLIC_CAPTCHA_ID,
                product: "bind",
                hideSuccess: true,
                userInfo: userId
            },
            handlerForBind
        );

        // @ts-expect-error GeeTest types suck
        function handlerForBind(captcha) {
            const btn = button.current;
            let isReady = false;

            captcha.onReady(() => {
                isReady = true;
            });

            btn?.addEventListener("click", () => {
                if (!isReady || state === State.Success) return;

                setState(State.Idle);
                setError(null);

                captcha.showCaptcha();
            });

            captcha.onSuccess(async () => {
                setState(State.Loading);

                const result = captcha.getValidate();
                const res = await fetch(process.env.NEXT_PUBLIC_API + path, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(result)
                })
                    .catch(() => null);

                if (!res?.ok) {
                    captcha.destroy();
                    setState(State.Idle);

                    const { message } = res
                        ? await res.json()
                        : { message: "Unknown server error" };

                    setError(message);
                    return;
                }

                setState(State.Success);
            });

            captcha.onError((err: string) => {
                captcha.reset();
                setState(State.Idle);
                setError(err || "Unknown captcha error");
            });

            captcha.onClose(() => {
                captcha.reset();
                setState(State.Idle);
            });
        }
    }, [path, userId]);

    return { state, error, button };
}