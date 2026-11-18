/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BidForm from "./BidForm";

const { addBid, placeBidForAuction, toastError } = vi.hoisted(() => ({
    addBid: vi.fn(),
    placeBidForAuction: vi.fn(),
    toastError: vi.fn()
}));

vi.mock("@/app/actions/auctionActions", () => ({
    placeBidForAuction
}));

vi.mock("@/app/hooks/useBidStore", () => ({
    useBidStore: (selector: (state: { addBid: typeof addBid }) => unknown) => selector({ addBid })
}));

vi.mock("react-hot-toast", () => ({
    default: { error: toastError }
}));

const auctionId = "auction-1";
const highBid = 2500;
const acceptedBid = {
    id: "bid-1",
    auctionId,
    bidder: "buyer",
    bidTime: "2026-11-18T00:00:00Z",
    amount: 3000,
    bidStatus: "Accepted"
};

afterEach(() => {
    cleanup();
});

function submitBid(amount: string) {
    const input = screen.getByPlaceholderText("Enter your bid (minimum bid is $2,501)");
    fireEvent.change(input, { target: { value: amount } });

    const form = input.closest("form");
    if (!form) {
        throw new Error("Bid input must be inside a form");
    }

    fireEvent.submit(form);
    return input;
}

describe("BidForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        placeBidForAuction.mockResolvedValue(acceptedBid);
    });

    it("rejects a bid that does not exceed the current high bid", async () => {
        render(<BidForm auctionId={auctionId} highBid={highBid} />);

        const input = submitBid(String(highBid));

        await waitFor(() => {
            expect(toastError).toHaveBeenCalledWith("Bid must be at least $2,501");
        });
        expect(placeBidForAuction).not.toHaveBeenCalled();
        expect(addBid).not.toHaveBeenCalled();
        expect(input).toHaveProperty("value", "");
    });

    it("submits an accepted bid and adds it to the bid store", async () => {
        render(<BidForm auctionId={auctionId} highBid={highBid} />);

        const input = submitBid(String(acceptedBid.amount));

        await waitFor(() => {
            expect(placeBidForAuction).toHaveBeenCalledWith(auctionId, acceptedBid.amount);
            expect(addBid).toHaveBeenCalledWith(acceptedBid);
        });
        expect(toastError).not.toHaveBeenCalled();
        expect(input).toHaveProperty("value", "");
    });
});
