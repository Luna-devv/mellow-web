import { Section } from "@/components/section";

import { getStatus } from "./api";
import { Cluster } from "./cluster.component";
import { Node } from "./node.component";
import { Side } from "./side.component";

export default async function Home() {
    const status = await getStatus();

    if (!status || "message" in status) return;

    return (<>
        <div className="md:flex gap-4 mb-12">
            <div className="grid gap-2 grid-cols-2 lg:grid-cols-3 w-full md:w-3/4">
                {status.clusters.map((cluster) => (
                    <Cluster
                        key={"cluster-" + cluster.id}
                        {...cluster}
                    />
                ))}
            </div>

            <div className="lg:w-1/4 md:w-1/3 mt-8 md:mt-0">
                <Side
                    status={status}
                />
            </div>
        </div>

        <Section title="TTS & VC Nodes">
            The streaming servers used for in Voice-Chat Text to Speech!
        </Section>

        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
            {status.nodes.map((node, i) => (
                <Node
                    key={"node-" + node.id}
                    node={node}
                    index={i + 1}
                />
            ))}
        </div>
    </>);
}
