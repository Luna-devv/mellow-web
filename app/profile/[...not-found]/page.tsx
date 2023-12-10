import { HiIdentification } from "react-icons/hi";

import { ScreenMessage } from "@/components/screen-message";

export default function NotFound() {

    return (
        <ScreenMessage
            title="Nothing to see here.."
            description="Seems like you got a little lost, huh?"
            href="/profile"
            button="Go back to overview"
            icon={<HiIdentification />}
        />
    );
}