import Row from "./row.component";

interface Item {
    name: string;
    value: string;
}

export default function Panel({
    name,
    items,
    action,
    children
}: {
    name: string;
    items: Item[],
    action?: (item: Item) => React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-medium text-neutral-200">{name}</h2>

            <div className="mt-2 flex flex-col gap-3 divide-y-1 divide-wamellow">

                {items.map((item) => (
                    <Row
                        name={item.name}
                        value={item.value}
                        key={item.name}
                    >
                        {action && action(item)}
                    </Row>
                ))}

            </div>

            {children}
        </div>
    )
}