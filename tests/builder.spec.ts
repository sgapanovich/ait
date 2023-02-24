import { faker } from "@faker-js/faker";
import { test, expect, request } from "@playwright/test";
import { calculateDate } from "../lib/date";

test.describe("Data builder", async () => {
  let authCookie;
  let roomName: string;
  let roomTypes = ["Single", "Twin", "Double", "Family", "Suite"];
  let roomType: string;
  let image = "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg";
  let allFeatures = ["WiFi", "TV", "Radio", "Refreshments", "Safe", "Views"];
  let roomFeatures;
  let description = faker.lorem.paragraph();
  let amount: number;

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

  test.beforeEach(async () => {
    roomName = "" + Date.now();
    roomType = roomTypes[faker.datatype.number({min: 0, max: roomTypes.length - 1})];
    amount = faker.datatype.number({min: 1, max: 1000, precision: 0.01});
    roomFeatures = allFeatures[faker.datatype.number({min: 0, max: allFeatures.length - 1})]
  });


  test.only("Create rooms and bookings", async () => {
    test.setTimeout(220000)

    for(let i = 0; i < 10; i++){
        let postRoom = await request.newContext();
        let response = await postRoom.post('http://localhost:3001/room/', {
            headers: {
                "Cookie": authCookie,
            },
          data: {
            roomName: roomName.slice(-5),
            type: roomType,
            accessible: faker.datatype.boolean(),
            image: image,
            description: description,
            features: [roomFeatures],
            roomPrice: amount,
          },
        });

        expect(response.status()).toBe(201);
        let body = await response.json();

        console.log("Room #" + i + " created! Id" + body.roomid)


        // booking part
        let startDate = 50
        let endDate = 51

        for (let i = 0; i < 100; i++) {
            await new Promise((r) => setTimeout(r, 100));
            const postBook = await request.newContext();
            const responseBook = await postBook.post('http://localhost:3000/booking/', {
                headers: {
                    Cookie: authCookie
                },
              data: {
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                depositpaid: faker.datatype.boolean(),
                roomid: body.roomid,
                bookingdates: {
                    checkin: calculateDate(startDate),
                    checkout: calculateDate(endDate)
                },
              },
            });
    
            expect(responseBook.status()).toBe(201);
            let bodyBook = await responseBook.json();
    
            console.log("Booking #" + i + " created for the room id " + body.roomid + "! Id" + bodyBook.bookingid)
            
            startDate += 1
            endDate +=1
        }
    }
  });
});
