export function Shiggy(props: React.ComponentProps<"video">) {
    return (
        <video
            autoPlay
            loop
            muted
            {...props}
        >
            <source src="/shiggy.webm" type="video/webm" />
        </video>
    );
}