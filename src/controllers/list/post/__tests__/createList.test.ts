import { Request } from "express";
import { createList } from "../createList";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    },
}));

const mockedList = List as unknown as {
    create: jest.Mock;
};

describe("createList controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("creates list with normalized items and members and returns 201", async () => {
        const dtoIn = {
            listName: "Groceries",
            items: [{ itemName: "Bread" }, { itemName: "Milk" }],
            members: [{ _id: "user-1" }, { id: "user-2" }, "user-3"],
        };

        const req = {
            dtoIn,
            user: { id: "owner-id" },
        } as unknown as Request;

        const docObj = {
            _id: "list-1",
            ownerId: "owner-id",
            listName: "Groceries",
            dateCreated: "2025-01-01T00:00:00.000Z",
            state: "active",
            items: [
                { _id: "a", itemName: "Bread", completed: false },
                { _id: "b", itemName: "Milk", completed: false },
            ],
            members: ["user-1", "user-2", "user-3"],
        };

        const fakeDoc = {
            toObject: jest.fn().mockReturnValue(docObj),
        };

        mockedList.create.mockResolvedValueOnce(fakeDoc);

        const { res, status, json } = createMockRes();
        await createList(req, res);

        expect(mockedList.create).toHaveBeenCalledWith(
            expect.objectContaining({
                _id: expect.any(String),
                ownerId: "owner-id",
                listName: "Groceries",
                dateCreated: expect.any(String),
                state: "active",
                items: [
                    expect.objectContaining({
                        itemName: "Bread",
                        completed: false,
                        _id: expect.any(String),
                    }),
                    expect.objectContaining({
                        itemName: "Milk",
                        completed: false,
                        _id: expect.any(String),
                    }),
                ],
                members: ["user-1", "user-2", "user-3"],
            }),
        );

        expect(status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith(docObj);
    });

    it("returns 500 on error", async () => {
        const dtoIn = {
            listName: "Groceries",
            items: [],
            members: [],
        };

        const req = {
            dtoIn,
            user: { id: "owner-id" },
        } as unknown as Request;

        mockedList.create.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await createList(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
