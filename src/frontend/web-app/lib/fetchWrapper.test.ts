import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mockedAuth = vi.hoisted(() => vi.fn(async () => null));

vi.mock("@/auth", () => ({
    auth: mockedAuth
}));

const fetchMock = vi.fn<typeof fetch>();
let fetchWrapper: typeof import("./fetchWrapper").fetchWrapper;

beforeAll(async () => {
    vi.stubEnv("API_URL", "https://api.example.test/");
    ({ fetchWrapper } = await import("./fetchWrapper"));
});

beforeEach(() => {
    mockedAuth.mockResolvedValue(null);
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

afterAll(() => {
    vi.unstubAllEnvs();
});

describe("fetchWrapper responses", () => {
    it("returns parsed JSON for a successful response", async () => {
        const data = { id: "auction-1" };
        fetchMock.mockResolvedValue(new Response(JSON.stringify(data), { status: 200 }));

        await expect(fetchWrapper.get("auctions/auction-1")).resolves.toEqual(data);
    });

    it("returns text for a successful non-JSON response", async () => {
        fetchMock.mockResolvedValue(new Response("Accepted", { status: 200 }));

        await expect(fetchWrapper.get("auctions")).resolves.toBe("Accepted");
    });

    it("returns the status text for a successful empty response", async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 204, statusText: "No Content" }));

        await expect(fetchWrapper.get("auctions")).resolves.toBe("No Content");
    });

    it("returns the status and response text for an unsuccessful response", async () => {
        fetchMock.mockResolvedValue(new Response("Auction not found", { status: 404 }));

        await expect(fetchWrapper.get("auctions/missing")).resolves.toEqual({
            error: {
                status: 404,
                message: "Auction not found"
            }
        });
    });

    it("uses the status text when an unsuccessful response contains JSON", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: "Invalid bid" }), {
            status: 400,
            statusText: "Bad Request"
        }));

        await expect(fetchWrapper.get("bids")).resolves.toEqual({
            error: {
                status: 400,
                message: "Bad Request"
            }
        });
    });
});
