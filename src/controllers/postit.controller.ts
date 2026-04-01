import {
  findPostitsByUser,
  createPostit,
  updatePostit,
  deletePostit,
} from "@/models/postit.model";
import { Postit, UpdatePostitDTO } from "@/types";

export async function getUserPostits(userId: string): Promise<Postit[]> {
  return findPostitsByUser(userId);
}

export async function addPostit(
  userId: string,
  color: string = "#fde99a"
): Promise<Postit> {
  // Position aléatoire dans la zone du board (offset léger pour éviter pile-à-pile)
  const pos_x = 20 + Math.random() * 40;
  const pos_y = 10 + Math.random() * 30;
  const rotation = (Math.random() - 0.5) * 6;

  return createPostit({ user_id: userId, content: "", color, pos_x, pos_y, rotation });
}

export async function movePostit(
  postitId: string,
  pos_x: number,
  pos_y: number
): Promise<Postit> {
  return updatePostit(postitId, { pos_x, pos_y });
}

export async function editPostit(
  postitId: string,
  dto: UpdatePostitDTO
): Promise<Postit> {
  return updatePostit(postitId, dto);
}

export async function removePostit(postitId: string): Promise<void> {
  return deletePostit(postitId);
}
