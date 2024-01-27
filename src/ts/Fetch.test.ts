import { fetchData, fetchDataAndHeaders } from "ts/Fetch";


describe("fetchData", () => {
    test("success", async () => {
        const fakeData = { data: "12345" };
        fetchMock.mockOnce(JSON.stringify(fakeData));

        const result = await fetchData("https://example.com", "Error message");

        expect(result).toEqual(fakeData);
    });

    test("fail", async () => {
        fetchMock.mockOnce(JSON.stringify({}), { status: 404 });

        await expect(fetchData("https://example.com", "Error message")).rejects.toBe(
            "Error message"
        );
    });
});

describe("fetchDataAndHeaders", () => {
    test("success", async () => {
        const fakeData = { data: "12345" };
        fetchMock.mockOnce(JSON.stringify(fakeData), {
            headers: { "Content-Type": "application/json" },
        });

        const result = await fetchDataAndHeaders("https://example.com", "Error message");

        expect.soft(result.data).toEqual(fakeData);
        expect.soft(result.headers.get("Content-Type")).toBe("application/json");
    });

    test("fail", async () => {
        fetchMock.mockOnce(JSON.stringify({}), { status: 404 });

        await expect(fetchDataAndHeaders("https://example.com", "Error message")).rejects.toBe(
            "Error message"
        );
    });
});
