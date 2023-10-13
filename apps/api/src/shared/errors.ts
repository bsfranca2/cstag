// import { HTTPException } from 'hono/http-exception';

// export class BadRequestError extends HTTPException {
//   constructor(message: string) {
//     super(400, {
//       res: new Response(JSON.stringify({ message }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json; charset=UTF-8' },
//       }),
//     });
//   }
// }
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}
