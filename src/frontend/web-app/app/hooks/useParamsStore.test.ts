import { beforeEach, describe, expect, it } from "vitest";
import { useParamsStore } from "./useParamsStore";

describe("useParamsStore", () => {
    beforeEach(() => {
        useParamsStore.getState().reset();
    });

    it("resets the page when filters change and preserves other parameters", () => {
        useParamsStore.getState().setParams({
            pageSize: 8,
            orderBy: "new",
            seller: "seller-id"
        });
        useParamsStore.getState().setParams({ pageNumber: 3 });

        useParamsStore.getState().setParams({
            filterBy: "finished",
            searchTerm: "roadster"
        });

        expect(useParamsStore.getState()).toMatchObject({
            pageNumber: 1,
            pageSize: 8,
            orderBy: "new",
            filterBy: "finished",
            searchTerm: "roadster",
            seller: "seller-id"
        });
    });

    it("changes the page without resetting active search and filters", () => {
        useParamsStore.getState().setParams({
            pageSize: 8,
            searchTerm: "roadster",
            orderBy: "endingSoon",
            filterBy: "finished",
            winner: "winner-id"
        });
        useParamsStore.getState().setParams({ pageNumber: 4 });

        useParamsStore.getState().setParams({ pageNumber: 2 });

        expect(useParamsStore.getState()).toMatchObject({
            pageNumber: 2,
            pageSize: 8,
            searchTerm: "roadster",
            orderBy: "endingSoon",
            filterBy: "finished",
            winner: "winner-id"
        });
    });

    it("restores the initial parameters on reset", () => {
        useParamsStore.getState().setParams({
            pageNumber: 5,
            pageSize: 4,
            searchTerm: "roadster",
            orderBy: "new",
            filterBy: "finished",
            seller: "seller-id",
            winner: "winner-id"
        });

        useParamsStore.getState().reset();

        expect(useParamsStore.getState()).toMatchObject({
            pageNumber: 1,
            pageSize: 12,
            pageCount: 1,
            searchTerm: "",
            orderBy: "make",
            filterBy: "live",
            seller: undefined,
            winner: undefined
        });
    });
});
