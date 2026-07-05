import authController from "@/src/modules/auth/controller";


export async function POST() {
  return authController.logout();
}