import Image from "next/image";

import { AddButton, HomeButton, ScreenMessage } from "@/components/screen-message";
import SadWumpusPic from "@/public/sad-wumpus.gif";

export default function NotFound() {
    return (
        <ScreenMessage
            title="Sadly, this page can not be found.."
            description="Seems like you got a little lost here? Here's wumpus for now!"
            buttons={<>
                <HomeButton />
                <AddButton />
            </>}
        >
            <Image src={SadWumpusPic} alt="" height={141 * 1.5} width={124 * 1.5} />
        </ScreenMessage>
    );
}