import { Chip, Slider as UiSlider } from "@nextui-org/react";
import { useState } from "react";
import { TailSpin } from "react-loading-icons";

import cn from "@/utils/cn";

import { request } from "./request";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Props {
    className?: string;

    name: string;
    badge?: string;
    disabled?: boolean;
    description?: string;

    minValue?: number
    maxValue?: number;
    steps?: number;

    url: string
    dataName: string;
    defaultState: number;
}

export default function Slider({
    className,

    name,
    badge,
    description,
    disabled,

    minValue = 0.1,
    maxValue = 1,
    steps = 0.1,

    url,
    dataName,
    defaultState
}: Props) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    function update(now: number | number[]) {
        setState(State.Loading);
        setError(null);

        request(url, {
            key: dataName,
            body: now,

            onSuccess: () => {
                setState(State.Success);
                setTimeout(() => setState(State.Idle), 1_000 * 8);
            },
            onError: (err) => {
                setState(State.Idle);
                setError(err);
            }
        });
    }

    return (
        <div className={cn("relative mb-4", className)}>

            <div>
                <div className="flex items-center gap-2">
                    <span className="sm:text-lg font-medium dark:text-neutral-400 text-neutral-600">
                        {name}
                    </span>

                    {badge &&
                        <Chip
                            variant="flat"
                            color="secondary"
                            size="sm"
                        >
                            {badge}
                        </Chip>
                    }

                    {state === State.Loading &&
                        <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />
                    }
                </div>

                <UiSlider
                    size="md"
                    step={steps}
                    color="secondary"
                    showSteps={true}
                    maxValue={maxValue}
                    minValue={minValue}
                    defaultValue={defaultState}
                    onChangeEnd={update}
                    isDisabled={disabled}
                />
            </div>


            <div className="flex gap-2">
                {description &&
                    <div className="text-neutral-500 text-sm">
                        {description}
                    </div>
                }

                {error &&
                    <div className="ml-auto text-red-500 text-sm shrink-0">
                        {error}
                    </div>
                }
            </div>

        </div>
    );
}