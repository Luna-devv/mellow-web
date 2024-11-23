import { SVGProps } from "react";

import InvitesIcon from "@/components/icons/invites";
import MessagesIcon from "@/components/icons/messages";
import VoiceIcon from "@/components/icons/voice";
import { cn } from "@/utils/cn";

type Props = SVGProps<SVGSVGElement> & {
    type: "messages" | "voiceminutes" | "invites"
}

export default function Icon({
    type,
    className,
    ...props
}: Props) {
    switch (type) {
        case "voiceminutes":
            return <VoiceIcon height="0.9em" className={cn("mt-1 ml-1", className)} {...props} />;
        case "invites":
            return <InvitesIcon height="0.9em" className={cn("mt-1.5", className)} {...props} />;
        default:
            return <MessagesIcon height={cn("0.9em", className)} {...props} />;
    }
}