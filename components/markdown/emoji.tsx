/* eslint-disable @next/next/no-img-element */

export default function Emoji({
    emojiId
}: {
    emojiId: string;
}) {
    return (
        <img
            alt='emoji'
            className='rounded-md inline h-5 w-5'
            src={`https://cdn.discordapp.com/emojis/${emojiId}.webp?size=40&quality=lossless`}
        />
    );
}