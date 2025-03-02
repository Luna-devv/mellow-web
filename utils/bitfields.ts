export class BitfieldManager {
    constructor(private flags: number) {}

    add(flag: number) {
        if (this.has(flag)) return;
        this.flags |= flag;
    }

    remove(flag: number) {
        if (!this.has(flag)) return;
        this.flags &= ~flag;
    }

    has(flag: number) {
        return (this.flags & flag) === flag;
    }

    toArray() {
        const flags: number[] = [];
        let field = this.flags;
        let bit = 1;

        while (field > 0) {
            if (field & bit) {
                flags.push(bit);
                field -= bit;
            }
            bit <<= 1;
        }

        return flags;
    }
}

export function bitfieldToArray(bitfield: Record<string | number, string | number>) {
    return Object.entries(bitfield)
        .filter(([_, value]) => typeof value === "number")
        .map(([name, value]) => ({
            name: name.replace(/[a-z][A-Z]/g, (s) => s[0] + " " + s[1]),
            value
        }));
}