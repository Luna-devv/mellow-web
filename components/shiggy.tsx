export function Shiggy(props: React.ComponentProps<"video">) {
    return (
        <video
            autoPlay
            loop
            muted
            {...props}
        >
            <source src="/shiggy.webm" type="video/webm" />
            <track src="/shiggy.vtt" kind="captions" srcLang="en" label="english_captions"></track>
            what the fuck
        </video>
    );
}