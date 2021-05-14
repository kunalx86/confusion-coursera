import { UserDocument } from "src/models/Users";

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
