import { Request } from "express";
import { toggleItemStatus } from "../toggleItemStatus";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
    },
}));

type FakeItem = {
    _id: string;
    completed: boolean;
};

type FakeList = {
    items: FakeItem[];
    save: jest.Mock;
    toObject: jest.Mock;
};

const mockedList = List as unknown as {
    findById: jest.Mock;
};

describe("toggleItemStatus controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns 404 if list not found", async () => {
        const dtoIn = { id: "missing", itemId: "item-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findById.mockResolvedValueOnce(null);

        const { res, status, json } = createMockRes();
        await toggleItemStatus(req, res);

        expect(mockedList.findById).toHaveBeenCalledWith("missing");
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "List not found" });
    });

    it("returns 404 if item not found in list", async () => {
        const dtoIn = { id: "list-1", itemId: "missing-item" };
        const req = { dtoIn } as unknown as Request;

        const fakeList: FakeList = {
            items: [{ _id: "item-1", completed: false }],
            save: jest.fn(),
            toObject: jest.fn(),
        };

        mockedList.findById.mockResolvedValueOnce(fakeList);

        const { res, status, json } = createMockRes();
        await toggleItemStatus(req, res);

        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "Item not found" });
        expect(fakeList.save).not.toHaveBeenCalled();
    });

    it("toggles item.completed, saves list and returns updated list", async () => {
        const dtoIn = { id: "list-1", itemId: "item-1" };
        const req = { dtoIn } as unknown as Request;

        const listObj = {
            _id: "list-1",
            items: [
                { _id: "item-1", completed: true },
                { _id: "item-2", completed: false },
            ],
        };

        const fakeList: FakeList = {
            items: [
                { _id: "item-1", completed: false },
                { _id: "item-2", completed: false },
            ],
            save: jest.fn().mockResolvedValue(undefined),
            toObject: jest.fn().mockReturnValue(listObj),
        };

        mockedList.findById.mockResolvedValueOnce(fakeList);

        const { res, status, json } = createMockRes();
        await toggleItemStatus(req, res);

        const toggled = fakeList.items.find((i) => i._id === "item-1");
        expect(toggled?.completed).toBe(true);
        expect(fakeList.save).toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(listObj);
    });

    it("returns 500 on error", async () => {
        const dtoIn = { id: "list-1", itemId: "item-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findById.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await toggleItemStatus(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
