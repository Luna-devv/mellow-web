import Link from "next/link";
import { FunctionComponent } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";

const BeautifyMarkdown: FunctionComponent<{ markdown: string }> = ({ markdown }) => {


    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
                h2: ({ ...props }) => <Link
                    href={`#${props.children.toString().toLowerCase().replace(/ +/g, "-")}`}
                    className="flex mt-6 mb-2 cursor-pointer text-neutral-100 hover:underline"
                >
                    <div id={props.children.toString().toLowerCase().replace(/ +/g, "-")} className="text-2xl font-semibold" {...props} />
                </Link>,

                strong: ({ ...props }) => <span className="font-semibold text-neutral-200" {...props} />,
                i: ({ ...props }) => <span className="italic" {...props} />,
                a: ({ ...props }) => <a className="text-blue-500 hover:underline underline-blue-500" {...props} />,
                del: ({ ...props }) => <span className="line-through" {...props} />,
                ins: ({ ...props }) => <span className="underline" {...props} />,
                li: ({ ...props }) => <div className="flex gap-1 my-1">
                    <span className="mr-1">•</span>
                    <span {...props} />
                </div>
            }}
        >
            {markdown}
        </ReactMarkdown>
    );

};

export default BeautifyMarkdown;