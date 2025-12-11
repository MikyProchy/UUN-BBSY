import { Request } from "express";
import { removeMember } from "../removeMember";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
    },
}));

type FakeList = {
    members: string[];
    save: jest.Mock;
    toObject: jest.Mock;
};

const mockedList = List as unknown as {
    findById: jest.Mock;
};

describe("removeMember controller", () => {
    it("returns 404 if list not found", async () => {
        const dtoIn = { id: "missing", memberId: "user-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findById.mockResolvedValueOnce(null);

        const { res, status, json } = createMockRes();
        await removeMember(req, res);

        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "List not found" });
    });

    it("returns 404 if member not found in list", async () => {
        const dtoIn = { id: "list-1", memberId: "missing-user" };
        const req = { dtoIn } as unknown as Request;

        const fakeList: FakeList = {
            members: ["user-1", "user-2"],
            save: jest.fn(),
            toObject: jest.fn(),
        };

        mockedList.findById.mockResolvedValueOnce(fakeList);

        const { res, status, json } = createMockRes();
        await removeMember(req, res);

        expect(fakeList.members).toHaveLength(2);
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({
            message: "Member not found in this list",
            memberId: "missing-user",
        });
        expect(fakeList.save).not.toHaveBeenCalled();
    });

    it("removes member, saves list and returns updated list", async () => {
        const dtoIn = { id: "list-1", memberId: "user-2" };
        const req = { dtoIn } as unknown as Request;

        const listObj = {
            _id: "list-1",
            members: ["user-1"],
        };

        const fakeList: FakeList = {
            members: ["user-1", "user-2"],
            save: jest.fn().mockResolvedValue(undefined),
            toObject: jest.fn().mockReturnValue(listObj),
        };

        mockedList.findById.mockResolvedValueOnce(fakeList);

        const { res, status, json } = createMockRes();
        await removeMember(req, res);

        expect(fakeList.members).toEqual(["user-1"]);
        expect(fakeList.save).toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
            message: "Member removed",
            ...listObj,
        });
    });

    it("returns 500 on error", async () => {
        const dtoIn = { id: "list-1", memberId: "user-2" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findById.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await removeMember(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
