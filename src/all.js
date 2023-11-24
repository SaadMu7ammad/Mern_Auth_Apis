// import { myData, fetchData } from '../Controllers/userController';
// import { sum } from '../Controllers/userController';

// test('check if array contain 5 el', () => {
//   expect(myData).toHaveLength(5);
// });

// test('check if array contain number 5', () => {
//   expect(myData).toContain(5);
// });
// test('check if array not contain number 0', () => {
//   for (let i = 0; i < myData.length; i++) {
//     expect(myData[i]).not.toBe(0);
//   }
// });

// test('Mock test', () => {
//   const x = jest.fn((n1 = 0, n2 = 0) => n1 + n2);
//   expect(x(1, 4)).toBe(5);
//   expect(x(1)).toBe(1);
//   expect(x).toHaveBeenCalled();
//   expect(x).toHaveBeenCalledTimes(2);
//   // expect(x).toHaveBeenCalledWith(4);//False coz its called with 1& 4
//   expect(x).toHaveBeenCalledWith(1); //true
//   expect(x).toHaveBeenLastCalledWith(1); //true
// });

// test('check async one', async () => {
//   const todo = await fetchData(2);
//   expect(todo.id).toBe(2);
// });
