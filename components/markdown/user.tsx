export default function User({
    username
}: {
    username: string;
}) {
    return (
        <span className='bg-blurple/25 hover:bg-blurple/50 p-1 rounded-md dark:text-neutral-100 text-neutral-900 font-light text-sx duration-200 cursor-pointer'>
            @{username}
        </span>
    )
};