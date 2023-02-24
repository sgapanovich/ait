import { test, expect, request } from '@playwright/test';

test.describe("API testing", async () => {
  let authCookie;

  test.beforeAll(async ({baseURL}) => {
    const authRequest = await request.newContext();
    const response = await authRequest.post(baseURL + '/auth/login', {
        data: {
            "username": "admin",
            "password": "password"
        }
    });

    authCookie = response.headers()["set-cookie"].split(";")[0]
  })

  test('Report has correct structure', async ({baseURL}) => {
    const getReport = await request.newContext();
    const response = await getReport.get(baseURL + '/report/', {
        headers: {
            Cookie: authCookie
        }
    });

    expect(response.status()).toBe(200)
    let body = await response.json()
    expect(Object.keys(body)).toHaveLength(1)

    body.report.forEach((report) => {
        expect(Object.keys(report)).toEqual(["start", "end", "title"])
        expect(typeof report.start).toBe("string")
        expect(typeof report.end).toBe("string")
        expect(typeof report.title).toBe("string")
    })
  });

  test('Booking API is available', async ({baseURL}) => {
    const getBooking = await request.newContext();
    const response = await getBooking.get(baseURL + '/booking/', {
        headers: {
            Cookie: authCookie
        }
    });

    expect(response.status()).toBe(200)
  });

  test('Room API is available', async ({baseURL}) => {
    const getBooking = await request.newContext();
    const response = await getBooking.get(baseURL + '/room/', {
        headers: {
            Cookie: authCookie
        }
    });

    expect(response.status()).toBe(200)
  });
})

